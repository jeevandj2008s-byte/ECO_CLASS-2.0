import { ClassroomAutomationInput, AutomationDecision, DeviceAction } from './types';
import { calculateZoneLighting } from './lighting';
import { calculateFanControl } from './fan';

const SENSOR_STALE_TIMEOUT_MS = 60 * 1000; // 60 seconds without sensor data triggers failsafe

export function evaluateClassroomAutomation(
  input: ClassroomAutomationInput,
  now: Date = new Date()
): AutomationDecision {
  const actions: DeviceAction[] = [];
  const events: AutomationDecision['events'] = [];
  const nowMs = now.getTime();

  // 1. Check Sensor Freshness (Safety Failsafe)
  const lastSensorMs = new Date(input.lastSensorReadingAt).getTime();
  const isStale = isNaN(lastSensorMs) || (nowMs - lastSensorMs > SENSOR_STALE_TIMEOUT_MS);

  if (isStale) {
    // Failsafe Mode: If sensors drop offline, set safe defaults so occupants are not left in the dark
    for (const dev of input.devices) {
      if (dev.mode === 'forced_off') continue;

      if (dev.deviceType === 'light') {
        actions.push({
          deviceId: dev.deviceId,
          deviceType: 'light',
          zoneId: dev.zoneId,
          powerOn: true,
          brightnessPercent: 70, // Safe default illumination
          fanSpeed: 0,
          mode: dev.mode,
          reason: 'SENSOR_LOSS_FAILSAFE: Telemetry timed out. Reverted to safe illumination (70%).',
        });
      } else if (dev.deviceType === 'fan') {
        actions.push({
          deviceId: dev.deviceId,
          deviceType: 'fan',
          zoneId: dev.zoneId,
          powerOn: true,
          brightnessPercent: 0,
          fanSpeed: 2, // Safe gentle airflow
          mode: dev.mode,
          reason: 'SENSOR_LOSS_FAILSAFE: Telemetry timed out. Reverted to failsafe fan speed 2.',
        });
      }
    }

    events.push({
      eventType: 'FAILSAFE_TRIGGERED',
      triggerInputs: {
        lastSensorReadingAt: input.lastSensorReadingAt,
        staleMs: nowMs - (isNaN(lastSensorMs) ? 0 : lastSensorMs),
      },
      actionsTaken: { defaultLightBrightness: 70, defaultFanSpeed: 2 },
      explanation: 'Critical failsafe activated: Environmental sensors offline. Maintained safe lighting and ventilation.',
    });

    return {
      classroomId: input.classroomId,
      timestamp: now.toISOString(),
      actions,
      events,
      isFailsafe: true,
    };
  }

  // 2. Timetable Lookahead & Empty Room Grace Period
  const lookaheadMinutes = Math.floor(input.rule.timetable_lookahead_seconds / 60);
  const isUpcomingClassSoon =
    typeof input.upcomingClassInMinutes === 'number' &&
    input.upcomingClassInMinutes >= 0 &&
    input.upcomingClassInMinutes <= lookaheadMinutes;

  let isRoomEmptyGraceActive = false;
  let isRoomEmptyShutoff = false;

  if (input.totalOccupancy === 0) {
    if (isUpcomingClassSoon) {
      // Do not shut down if a class starts in 5-10 minutes!
      isRoomEmptyShutoff = false;
    } else if (input.roomEmptySince) {
      const emptySinceMs = new Date(input.roomEmptySince).getTime();
      const emptyDurationSec = (nowMs - emptySinceMs) / 1000;

      if (emptyDurationSec < input.rule.empty_grace_period_seconds) {
        isRoomEmptyGraceActive = true;
      } else {
        isRoomEmptyShutoff = true;
      }
    } else {
      isRoomEmptyShutoff = true;
    }
  }

  // 3. Evaluate Zone Lighting
  // Create a fast map of zones by ID and row index
  const zonesByRow = new Map(input.zones.map((z) => [z.rowIndex, z]));

  // Find light devices
  const lightDevices = input.devices.filter((d) => d.deviceType === 'light');

  for (const light of lightDevices) {
    // 3a. Check Manual Override
    if (light.mode !== 'auto') {
      const isOverrideActive =
        !light.overrideUntil || new Date(light.overrideUntil).getTime() > nowMs;

      if (isOverrideActive) {
        // Respect manual override - do NOT touch this device
        continue;
      }
    }

    // 3b. If whole room is empty and shutoff is triggered
    if (isRoomEmptyShutoff) {
      actions.push({
        deviceId: light.deviceId,
        deviceType: 'light',
        zoneId: light.zoneId,
        powerOn: false,
        brightnessPercent: 0,
        fanSpeed: 0,
        mode: 'auto',
        reason: 'Empty classroom grace elapsed with no upcoming scheduled classes. Auto-shutdown.',
      });
      continue;
    }

    // 3c. Calculate targeted zone lighting
    // Determine which zone/row this light belongs to
    const zone = input.zones.find((z) => z.id === light.zoneId);
    const rowIndex = zone ? zone.rowIndex : 1;
    const occupantsInThisRow = input.rowOccupancy[rowIndex] || 0;

    const targetLux = zone ? zone.targetLux : input.rule.target_lux;
    const minSafetyLux = zone ? zone.minSafetyLuxPercent : input.rule.empty_dim_percent;

    const lightResult = calculateZoneLighting({
      occupantsInZone: occupantsInThisRow,
      totalRoomOccupants: input.totalOccupancy,
      ambientLux: input.ambientLux,
      currentBrightness: light.currentBrightness,
      targetLux,
      minSafetyLuxPercent: minSafetyLux,
      hysteresis: input.rule.lux_hysteresis,
    });

    actions.push({
      deviceId: light.deviceId,
      deviceType: 'light',
      zoneId: light.zoneId,
      powerOn: lightResult.powerOn,
      brightnessPercent: lightResult.targetBrightnessPercent,
      fanSpeed: 0,
      mode: 'auto',
      reason: lightResult.explanation,
    });

    events.push({
      eventType: occupantsInThisRow > 0 ? 'ZONE_ILLUMINATION_ADAPT' : 'ZONE_IDLE_DIM',
      zoneId: light.zoneId,
      deviceId: light.deviceId,
      triggerInputs: {
        rowIndex,
        occupantsInRow: occupantsInThisRow,
        totalOccupancy: input.totalOccupancy,
        ambientLux: input.ambientLux,
      },
      actionsTaken: {
        brightness: lightResult.targetBrightnessPercent,
        powerOn: lightResult.powerOn,
      },
      explanation: lightResult.explanation,
    });
  }

  // 4. Evaluate Fans
  const fanDevices = input.devices.filter((d) => d.deviceType === 'fan');

  for (const fan of fanDevices) {
    // 4a. Check Manual Override
    if (fan.mode !== 'auto') {
      const isOverrideActive =
        !fan.overrideUntil || new Date(fan.overrideUntil).getTime() > nowMs;

      if (isOverrideActive) {
        continue;
      }
    }

    // 4b. If whole room is empty and shutoff is triggered
    if (isRoomEmptyShutoff) {
      actions.push({
        deviceId: fan.deviceId,
        deviceType: 'fan',
        zoneId: fan.zoneId,
        powerOn: false,
        brightnessPercent: 0,
        fanSpeed: 0,
        mode: 'auto',
        reason: 'Empty classroom grace elapsed. Fans switched off.',
      });
      continue;
    }

    const fanResult = calculateFanControl({
      totalOccupants: input.totalOccupancy,
      temperatureC: input.temperatureC,
      humidityPercent: input.humidityPercent,
      currentFanSpeed: fan.currentFanSpeed,
      tempThreshold: input.rule.temp_fan_threshold,
      tempHysteresis: input.rule.temp_hysteresis,
      humidityThreshold: input.rule.humidity_fan_threshold,
      isRoomEmptyGraceActive,
    });

    actions.push({
      deviceId: fan.deviceId,
      deviceType: 'fan',
      zoneId: fan.zoneId,
      powerOn: fanResult.powerOn,
      brightnessPercent: 0,
      fanSpeed: fanResult.targetSpeed,
      mode: 'auto',
      reason: fanResult.explanation,
    });

    events.push({
      eventType: fanResult.powerOn ? 'FAN_COOLING_ACTIVE' : 'FAN_IDLE_OFF',
      deviceId: fan.deviceId,
      triggerInputs: {
        totalOccupants: input.totalOccupancy,
        temperatureC: input.temperatureC,
        humidityPercent: input.humidityPercent,
      },
      actionsTaken: {
        fanSpeed: fanResult.targetSpeed,
        powerOn: fanResult.powerOn,
      },
      explanation: fanResult.explanation,
    });
  }

  return {
    classroomId: input.classroomId,
    timestamp: now.toISOString(),
    actions,
    events,
    isFailsafe: false,
  };
}

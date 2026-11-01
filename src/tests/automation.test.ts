import { describe, it, expect } from 'vitest';
import { evaluateClassroomAutomation } from '../lib/automation/engine';
import { ClassroomAutomationInput } from '../lib/automation/types';
import { AutomationRule } from '../lib/types/database.types';

const defaultRule: AutomationRule = {
  id: 'rule-test-1',
  classroom_id: 'c1',
  block_id: 'b1',
  rule_name: 'Test Rule',
  version: 1,
  is_active: true,
  target_lux: 400,
  lux_hysteresis: 30,
  empty_dim_percent: 10,
  temp_fan_threshold: 26.5,
  temp_hysteresis: 0.5,
  humidity_fan_threshold: 70,
  empty_grace_period_seconds: 300, // 5 min
  timetable_lookahead_seconds: 600, // 10 min
};

const defaultZones = [
  { id: 'z1', rowIndex: 1, name: 'Row 1', targetLux: 400, minSafetyLuxPercent: 10 },
  { id: 'z2', rowIndex: 2, name: 'Row 2', targetLux: 400, minSafetyLuxPercent: 10 },
  { id: 'z3', rowIndex: 3, name: 'Row 3', targetLux: 400, minSafetyLuxPercent: 10 },
  { id: 'z4', rowIndex: 4, name: 'Row 4', targetLux: 400, minSafetyLuxPercent: 10 },
  { id: 'z5', rowIndex: 5, name: 'Row 5', targetLux: 400, minSafetyLuxPercent: 10 },
];

const defaultDevices: ClassroomAutomationInput['devices'] = [
  { deviceId: 'light-1', zoneId: 'z1', deviceType: 'light', currentPower: false, currentBrightness: 0, currentFanSpeed: 0, mode: 'auto' },
  { deviceId: 'light-2', zoneId: 'z2', deviceType: 'light', currentPower: false, currentBrightness: 0, currentFanSpeed: 0, mode: 'auto' },
  { deviceId: 'light-3', zoneId: 'z3', deviceType: 'light', currentPower: false, currentBrightness: 0, currentFanSpeed: 0, mode: 'auto' },
  { deviceId: 'light-4', zoneId: 'z4', deviceType: 'light', currentPower: false, currentBrightness: 0, currentFanSpeed: 0, mode: 'auto' },
  { deviceId: 'light-5', zoneId: 'z5', deviceType: 'light', currentPower: false, currentBrightness: 0, currentFanSpeed: 0, mode: 'auto' },
  { deviceId: 'fan-1', zoneId: null, deviceType: 'fan', currentPower: false, currentBrightness: 0, currentFanSpeed: 0, mode: 'auto' },
];

describe('Core Automation Engine', () => {
  const baseTimestamp = new Date('2026-11-01T10:00:00.000Z');

  it('SCENARIO 1: One student on the last bench (Row 5) - only Row 5 is bright, Rows 1-4 are dimmed', () => {
    const input: ClassroomAutomationInput = {
      classroomId: 'c1',
      blockId: 'b1',
      totalOccupancy: 1,
      rowOccupancy: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 1 }, // Only row 5 has a student
      ambientLux: 150,
      temperatureC: 24.0,
      humidityPercent: 50,
      lastSensorReadingAt: baseTimestamp.toISOString(),
      devices: defaultDevices,
      zones: defaultZones,
      rule: defaultRule,
    };

    const decision = evaluateClassroomAutomation(input, baseTimestamp);

    // Verify row 5 light is bright
    const light5 = decision.actions.find((a) => a.deviceId === 'light-5');
    expect(light5).toBeDefined();
    expect(light5?.powerOn).toBe(true);
    expect(light5?.brightnessPercent).toBeGreaterThan(50); // deficit is 400 - 150 = 250 lux => ~56%

    // Verify rows 1-4 lights are dimmed to minimum safety level (10%)
    for (let r = 1; r <= 4; r++) {
      const light = decision.actions.find((a) => a.deviceId === `light-${r}`);
      expect(light).toBeDefined();
      expect(light?.powerOn).toBe(true);
      expect(light?.brightnessPercent).toBe(10); // minSafetyLuxPercent
    }

    // Verify fan is off because temp is 24°C (< 26.5°C)
    const fan = decision.actions.find((a) => a.deviceId === 'fan-1');
    expect(fan?.powerOn).toBe(false);
    expect(fan?.fanSpeed).toBe(0);
  });

  it('SCENARIO 2: Daylight harvesting on sunny day - dims artificial lighting in occupied room', () => {
    const inputSunny: ClassroomAutomationInput = {
      classroomId: 'c1',
      blockId: 'b1',
      totalOccupancy: 20,
      rowOccupancy: { 1: 4, 2: 4, 3: 4, 4: 4, 5: 4 },
      ambientLux: 650, // very bright sunny day (> target 400)
      temperatureC: 25.0,
      humidityPercent: 55,
      lastSensorReadingAt: baseTimestamp.toISOString(),
      devices: defaultDevices,
      zones: defaultZones,
      rule: defaultRule,
    };

    const decision = evaluateClassroomAutomation(inputSunny, baseTimestamp);

    // Occupied rows with abundant sunlight should dim to gentle fill (15%) rather than wasting power at 100%
    const light1 = decision.actions.find((a) => a.deviceId === 'light-1');
    expect(light1?.powerOn).toBe(true);
    expect(light1?.brightnessPercent).toBe(15);
  });

  it('SCENARIO 3: Fan cooling triggers on high temperature and humidity', () => {
    const inputHot: ClassroomAutomationInput = {
      classroomId: 'c1',
      blockId: 'b1',
      totalOccupancy: 25,
      rowOccupancy: { 1: 5, 2: 5, 3: 5, 4: 5, 5: 5 },
      ambientLux: 350,
      temperatureC: 29.5, // 3°C above threshold 26.5°C
      humidityPercent: 78, // above 70% threshold
      lastSensorReadingAt: baseTimestamp.toISOString(),
      devices: defaultDevices,
      zones: defaultZones,
      rule: defaultRule,
    };

    const decision = evaluateClassroomAutomation(inputHot, baseTimestamp);
    const fan = decision.actions.find((a) => a.deviceId === 'fan-1');

    expect(fan?.powerOn).toBe(true);
    expect(fan?.fanSpeed).toBeGreaterThanOrEqual(4); // speed scales high
  });

  it('SCENARIO 4: Empty room grace period and timetable lookahead', () => {
    // 4a: Empty room, but class starts in 5 minutes -> does NOT shut off
    const inputUpcomingClass: ClassroomAutomationInput = {
      classroomId: 'c1',
      blockId: 'b1',
      totalOccupancy: 0,
      rowOccupancy: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      ambientLux: 200,
      temperatureC: 25.0,
      humidityPercent: 50,
      lastSensorReadingAt: baseTimestamp.toISOString(),
      devices: defaultDevices,
      zones: defaultZones,
      rule: defaultRule,
      upcomingClassInMinutes: 5, // Timetable has class soon!
    };

    const decision1 = evaluateClassroomAutomation(inputUpcomingClass, baseTimestamp);
    const light1 = decision1.actions.find((a) => a.deviceId === 'light-1');
    // Because class is soon, does not shut off completely
    expect(light1?.brightnessPercent).toBe(10); // remains in standby safety dim

    // 4b: Empty room for 10 minutes with NO upcoming class -> auto shutdown
    const tenMinutesAgo = new Date(baseTimestamp.getTime() - 10 * 60 * 1000).toISOString();
    const inputEmptyExpired: ClassroomAutomationInput = {
      ...inputUpcomingClass,
      upcomingClassInMinutes: null,
      roomEmptySince: tenMinutesAgo, // Empty for 600s > grace 300s
    };

    const decision2 = evaluateClassroomAutomation(inputEmptyExpired, baseTimestamp);
    for (const action of decision2.actions) {
      expect(action.powerOn).toBe(false);
      expect(action.brightnessPercent).toBe(0);
      expect(action.fanSpeed).toBe(0);
    }
  });

  it('SCENARIO 5: Manual override protection - engine respects worker/HOD lock', () => {
    const devicesWithOverride: ClassroomAutomationInput['devices'] = [
      ...defaultDevices.slice(1),
      {
        deviceId: 'light-1',
        zoneId: 'z1',
        deviceType: 'light',
        currentPower: true,
        currentBrightness: 100, // forced 100% by worker
        currentFanSpeed: 0,
        mode: 'manual',
        overrideUntil: new Date(baseTimestamp.getTime() + 3600 * 1000).toISOString(), // 1 hour left
      },
    ];

    const input: ClassroomAutomationInput = {
      classroomId: 'c1',
      blockId: 'b1',
      totalOccupancy: 0, // Even if room is empty
      rowOccupancy: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      ambientLux: 700,
      temperatureC: 25.0,
      humidityPercent: 50,
      lastSensorReadingAt: baseTimestamp.toISOString(),
      devices: devicesWithOverride,
      zones: defaultZones,
      rule: defaultRule,
      roomEmptySince: new Date(baseTimestamp.getTime() - 600 * 1000).toISOString(),
    };

    const decision = evaluateClassroomAutomation(input, baseTimestamp);
    // light-1 should NOT be in actions list because it has an active manual override!
    const light1Action = decision.actions.find((a) => a.deviceId === 'light-1');
    expect(light1Action).toBeUndefined();
  });

  it('SCENARIO 6: Failsafe on sensor telemetry loss - safe illumination fallback', () => {
    // Sensor timestamp is 5 minutes old (> 60s stale threshold)
    const staleSensorTime = new Date(baseTimestamp.getTime() - 300 * 1000).toISOString();

    const inputStale: ClassroomAutomationInput = {
      classroomId: 'c1',
      blockId: 'b1',
      totalOccupancy: 15,
      rowOccupancy: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3 },
      ambientLux: 0,
      temperatureC: 0,
      humidityPercent: 0,
      lastSensorReadingAt: staleSensorTime,
      devices: defaultDevices,
      zones: defaultZones,
      rule: defaultRule,
    };

    const decision = evaluateClassroomAutomation(inputStale, baseTimestamp);

    expect(decision.isFailsafe).toBe(true);
    const light1 = decision.actions.find((a) => a.deviceId === 'light-1');
    expect(light1?.powerOn).toBe(true);
    expect(light1?.brightnessPercent).toBe(70); // Safe fallback brightness
    const fan1 = decision.actions.find((a) => a.deviceId === 'fan-1');
    expect(fan1?.fanSpeed).toBe(2); // Safe airflow
  });
});

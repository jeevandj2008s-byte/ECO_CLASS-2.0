import { NextResponse } from 'next/server';
import { deviceSimulator } from '@/lib/simulator/device-simulator';
import { evaluateClassroomAutomation } from '@/lib/automation/engine';
import { ClassroomAutomationInput } from '@/lib/automation/types';
import { AutomationRule } from '@/lib/types/database.types';

const defaultRule: AutomationRule = {
  id: 'rule-active-1',
  rule_name: 'Campus Standard Energy Profile',
  version: 1,
  is_active: true,
  target_lux: 400,
  lux_hysteresis: 30,
  empty_dim_percent: 10,
  temp_fan_threshold: 26.5,
  temp_hysteresis: 0.5,
  humidity_fan_threshold: 70,
  empty_grace_period_seconds: 300,
  timetable_lookahead_seconds: 600,
};

export async function POST() {
  const rooms = deviceSimulator.getAllClassrooms();
  const evaluationResults = [];

  for (const room of rooms) {
    const devices: ClassroomAutomationInput['devices'] = Array.from(room.devices.values()).map(
      (dev) => ({
        deviceId: dev.id,
        zoneId: dev.zoneId,
        deviceType: dev.type,
        currentPower: dev.powerOn,
        currentBrightness: dev.brightnessPercent,
        currentFanSpeed: dev.fanSpeed,
        mode: 'auto',
      })
    );

    const zones = [1, 2, 3, 4, 5].map((r) => ({
      id: `z-${r}`,
      rowIndex: r,
      name: `Row ${r}`,
      targetLux: 400,
      minSafetyLuxPercent: 10,
    }));

    const input: ClassroomAutomationInput = {
      classroomId: room.classroomId,
      blockId: room.blockId,
      totalOccupancy: room.occupancy.total,
      rowOccupancy: room.occupancy.rows,
      ambientLux: room.environment.lux,
      temperatureC: room.environment.temp,
      humidityPercent: room.environment.humidity,
      lastSensorReadingAt: new Date().toISOString(),
      devices,
      zones,
      rule: defaultRule,
    };

    const decision = evaluateClassroomAutomation(input);

    // Apply decisions to simulator
    for (const action of decision.actions) {
      deviceSimulator.executeCommand(room.classroomId, action.deviceId, {
        powerOn: action.powerOn,
        brightnessPercent: action.brightnessPercent,
        fanSpeed: action.fanSpeed,
      });
    }

    evaluationResults.push({
      classroom_id: room.classroomId,
      classroom_name: room.name,
      decision,
    });
  }

  return NextResponse.json({
    success: true,
    classrooms_evaluated: evaluationResults.length,
    results: evaluationResults,
    timestamp: new Date().toISOString(),
  });
}

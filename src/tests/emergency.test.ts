import { describe, it, expect, vi } from 'vitest';
import { EmergencyIncidentService } from '../lib/emergency/service';
import { deviceSimulator } from '../lib/simulator/device-simulator';

describe('Emergency Incident Help Desk & Electrical Safety Flow', () => {
  const roomId = 'c1000000-0000-0000-0000-000000000204';
  const blockId = 'b1000000-0000-0000-0000-000000000001';

  it('detects short circuit, trips power immediately, and creates critical incident', async () => {
    // Inject short circuit: 95A spike with voltage drop to 20V
    const result = await EmergencyIncidentService.evaluateTelemetry({
      classroomId: roomId,
      blockId,
      departmentId: 'd1000000-0000-0000-0000-000000000001',
      currentAmps: 95.0,
      voltageVolts: 20.0,
      powerWatts: 1900.0,
    });

    expect(result).not.toBeNull();
    expect(result?.powerCutApplied).toBe(true);
    expect(result?.status).toBe('open');

    // Simulator breaker should be tripped
    const roomState = deviceSimulator.getClassroom(roomId);
    expect(roomState?.isBreakerTripped).toBe(true);
    expect(roomState?.powerMeter.watts).toBe(0);
  });

  it('detects overcurrent condition (>25A) and triggers high severity alert', async () => {
    const result = await EmergencyIncidentService.evaluateTelemetry({
      classroomId: roomId,
      blockId,
      currentAmps: 32.4, // continuous overcurrent
      voltageVolts: 230.0,
      powerWatts: 7452.0,
    });

    expect(result).not.toBeNull();
    expect(result?.powerCutApplied).toBe(true);
  });

  it('normal telemetry does not trigger false positive incident', async () => {
    const result = await EmergencyIncidentService.evaluateTelemetry({
      classroomId: roomId,
      blockId,
      currentAmps: 1.8, // normal classroom load
      voltageVolts: 230.0,
      powerWatts: 414.0,
      temperatureC: 25.0,
    });

    expect(result).toBeNull();
  });
});

import { describe, it, expect } from 'vitest';
import { deviceSimulator } from '../lib/simulator/device-simulator';
import { mqttBroker } from '../lib/mqtt/client';
import { MQTT_TOPICS } from '../lib/mqtt/topics';

describe('Device Simulator & MQTT Integration', () => {
  const roomId = 'c1000000-0000-0000-0000-000000000204';

  it('initializes classroom with devices and responds to commands', () => {
    const room = deviceSimulator.getClassroom(roomId);
    expect(room).toBeDefined();
    expect(room?.devices.size).toBeGreaterThanOrEqual(7);

    // Apply scenario: lone_student_back
    const ok = deviceSimulator.applyScenario(roomId, 'lone_student_back');
    expect(ok).toBe(true);

    const updated = deviceSimulator.getClassroom(roomId);
    expect(updated?.occupancy.total).toBe(1);
    expect(updated?.occupancy.rows[5]).toBe(1);
    expect(updated?.occupancy.rows[1]).toBe(0);
  });

  it('executes device command and calculates live wattage', () => {
    const lightId = `light-r5-${roomId.slice(0, 8)}`;
    deviceSimulator.executeCommand(roomId, lightId, {
      powerOn: true,
      brightnessPercent: 80,
    });

    const room = deviceSimulator.getClassroom(roomId);
    const light = room?.devices.get(lightId);
    expect(light?.powerOn).toBe(true);
    expect(light?.brightnessPercent).toBe(80);
    // 80% of 60W rated = 48W
    expect(light?.currentWatts).toBe(48.0);
    expect(room?.powerMeter.watts).toBeGreaterThan(48.0);
  });

  it('publishes and receives MQTT messages across topics', async () => {
    let receivedPayload: any = null;
    const testTopic = 'ecoclass/campus/main/test/ping';

    mqttBroker.subscribe(testTopic, (_t, msg) => {
      receivedPayload = JSON.parse(msg.toString());
    });

    await mqttBroker.publish(testTopic, { test: 'pong', timestamp: Date.now() });

    expect(receivedPayload).not.toBeNull();
    expect(receivedPayload.test).toBe('pong');
  });
});

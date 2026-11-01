import { NextRequest, NextResponse } from 'next/server';
import { DeviceCommandSchema } from '@/lib/validation/schemas';
import { deviceSimulator } from '@/lib/simulator/device-simulator';
import { mqttBroker } from '@/lib/mqtt/client';
import { MQTT_TOPICS } from '@/lib/mqtt/topics';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = DeviceCommandSchema.parse(body);

    const rooms = deviceSimulator.getAllClassrooms();
    let targetRoom = null;
    for (const r of rooms) {
      if (r.devices.has(validated.device_id)) {
        targetRoom = r;
        break;
      }
    }

    if (!targetRoom) {
      targetRoom = rooms[0];
    }

    // Apply command in simulator
    deviceSimulator.executeCommand(targetRoom.classroomId, validated.device_id, {
      powerOn: validated.power_on,
      brightnessPercent: validated.brightness_percent,
      fanSpeed: validated.fan_speed,
    });

    // Publish to MQTT
    const topic = MQTT_TOPICS.command(
      targetRoom.campusId,
      targetRoom.blockId,
      targetRoom.classroomId,
      validated.device_id
    );

    await mqttBroker.publish(topic, {
      device_id: validated.device_id,
      power_on: validated.power_on,
      brightness_percent: validated.brightness_percent,
      fan_speed: validated.fan_speed,
      mode: validated.mode,
      idempotency_key: validated.idempotency_key || `cmd-${Date.now()}`,
      dispatched_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Command executed and broadcast via MQTT broker',
      device_id: validated.device_id,
      status: 'acknowledged',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Invalid command payload' },
      { status: 400 }
    );
  }
}

import { NextResponse } from 'next/server';
import { deviceSimulator } from '@/lib/simulator/device-simulator';

export async function GET() {
  const rooms = deviceSimulator.getAllClassrooms();
  const allDevices = [];

  for (const room of rooms) {
    for (const dev of room.devices.values()) {
      allDevices.push({
        id: dev.id,
        classroom_id: room.classroomId,
        classroom_name: room.name,
        device_type: dev.type,
        row_index: dev.rowIndex,
        power_on: dev.powerOn,
        brightness_percent: dev.brightnessPercent,
        fan_speed: dev.fanSpeed,
        live_watts: dev.currentWatts,
        rated_watts: dev.ratedWatts,
        is_online: true,
      });
    }
  }

  return NextResponse.json({ devices: allDevices });
}

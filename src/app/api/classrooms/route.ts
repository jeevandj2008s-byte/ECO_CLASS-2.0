import { NextResponse } from 'next/server';
import { deviceSimulator } from '@/lib/simulator/device-simulator';

export async function GET() {
  const simulatedRooms = deviceSimulator.getAllClassrooms();

  const classrooms = simulatedRooms.map((room) => ({
    id: room.classroomId,
    block_id: room.blockId,
    room_number: 'CR-204',
    name: room.name,
    capacity: 30,
    current_occupancy: room.occupancy.total,
    live_power_watts: room.powerMeter.watts,
    temperature_c: room.environment.temp,
    lux: room.environment.lux,
    circuit_healthy: !room.isBreakerTripped,
  }));

  return NextResponse.json({ classrooms });
}

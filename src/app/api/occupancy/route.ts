import { NextResponse } from 'next/server';
import { deviceSimulator } from '@/lib/simulator/device-simulator';

export async function GET() {
  const rooms = deviceSimulator.getAllClassrooms();

  const snapshots = rooms.map((room) => ({
    classroom_id: room.classroomId,
    classroom_name: room.name,
    total_people: room.occupancy.total,
    student_count: room.occupancy.students,
    teacher_count: room.occupancy.teachers,
    row_occupancy: room.occupancy.rows,
    confidence_score: 0.985,
    detected_at: new Date().toISOString(),
  }));

  return NextResponse.json({ snapshots });
}

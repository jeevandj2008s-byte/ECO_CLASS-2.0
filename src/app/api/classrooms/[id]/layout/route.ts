import { NextRequest, NextResponse } from 'next/server';
import { deviceSimulator } from '@/lib/simulator/device-simulator';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const room = deviceSimulator.getClassroom(id) || deviceSimulator.getAllClassrooms()[0];

  const rowsCount = 5;
  const benchesPerRow = 2; // Left side & Right side of aisle
  const seatsPerBench = 3; // 3 seats per bench

  const seats = [];
  let seatIndex = 1;

  for (let r = 1; r <= rowsCount; r++) {
    const occupantsInRow = room ? room.occupancy.rows[r] || 0 : 0;
    let placedInRow = 0;

    for (let b = 1; b <= benchesPerRow; b++) {
      for (let s = 1; s <= seatsPerBench; s++) {
        // Seat coordinate offsets (in meters)
        const xOffset = b === 1 ? -(1.8 - (s - 1) * 0.6) : (0.6 + (s - 1) * 0.6);
        const yOffset = 1.8 + (r - 1) * 1.3;
        const zOffset = 0.45; // desk seat height

        const isOccupied = placedInRow < occupantsInRow;
        if (isOccupied) placedInRow++;

        seats.push({
          seat_id: `seat-r${r}-b${b}-s${s}`,
          seat_number: seatIndex++,
          row_index: r,
          bench_index: b,
          seat_index_in_bench: s,
          position: { x: Number(xOffset.toFixed(2)), y: Number(yOffset.toFixed(2)), z: zOffset },
          is_occupied: isOccupied,
          person: isOccupied ? { role: 'user', label: `Student (Row ${r})` } : null,
        });
      }
    }
  }

  const layout = {
    classroom_id: id,
    room_dimensions: { width_m: 8.0, length_m: 10.0, height_m: 3.2 },
    rows_count: rowsCount,
    benches_per_row: benchesPerRow,
    seats_per_bench: seatsPerBench,
    total_seats: rowsCount * benchesPerRow * seatsPerBench,
    teacher_desk: { position: { x: 0.0, y: 0.8, z: 0.75 }, has_teacher: room ? room.occupancy.teachers > 0 : false },
    camera: { position: { x: 0.0, y: 7.0, z: 2.8 }, fov: 85 },
    seats,
  };

  return NextResponse.json(layout);
}

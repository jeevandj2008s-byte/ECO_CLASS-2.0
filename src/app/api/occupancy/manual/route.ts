import { NextRequest, NextResponse } from 'next/server';
import { ManualOccupancySchema } from '@/lib/validation/schemas';
import { deviceSimulator } from '@/lib/simulator/device-simulator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = ManualOccupancySchema.parse(body);

    // Convert string row keys to numbers
    const rows: Record<number, number> = {};
    for (const [k, v] of Object.entries(validated.row_occupancy)) {
      rows[parseInt(k, 10)] = v;
    }

    const ok = deviceSimulator.injectState(validated.classroom_id, {
      occupancy: {
        total: validated.total_students + validated.total_teachers,
        students: validated.total_students,
        teachers: validated.total_teachers,
        rows,
      },
    });

    if (!ok) {
      return NextResponse.json({ error: 'Classroom not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Occupancy updated in live digital twin',
      total_people: validated.total_students + validated.total_teachers,
      row_occupancy: rows,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { SimulatorInjectSchema } from '@/lib/validation/schemas';
import { deviceSimulator } from '@/lib/simulator/device-simulator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = SimulatorInjectSchema.parse(body);

    if (validated.scenario_code) {
      const ok = deviceSimulator.applyScenario(validated.classroom_id, validated.scenario_code);
      if (!ok) {
        return NextResponse.json({ error: 'Scenario code or classroom not found' }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        message: `Scenario '${validated.scenario_code}' applied to classroom`,
        classroom_state: deviceSimulator.getClassroom(validated.classroom_id),
      });
    }

    // Manual injection
    const ok = deviceSimulator.injectState(validated.classroom_id, {
      occupancy: validated.occupancy ? {
        total: validated.occupancy.total,
        students: validated.occupancy.students,
        teachers: validated.occupancy.teachers,
        rows: Object.fromEntries(
          Object.entries(validated.occupancy.rows).map(([k, v]) => [parseInt(k, 10), v])
        ),
      } : undefined,
      environment: validated.environment,
      incident: validated.incident,
    });

    if (!ok) {
      return NextResponse.json({ error: 'Classroom not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'State injected into simulator',
      classroom_state: deviceSimulator.getClassroom(validated.classroom_id),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

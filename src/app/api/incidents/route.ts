import { NextRequest, NextResponse } from 'next/server';
import { CreateIncidentSchema } from '@/lib/validation/schemas';
import { EmergencyIncidentService } from '@/lib/emergency/service';
import { deviceSimulator } from '@/lib/simulator/device-simulator';

// In-memory incidents feed for live demo and testing
let liveIncidents: any[] = [
  {
    id: 'inc-demo-1',
    classroom_id: 'c1000000-0000-0000-0000-000000000204',
    classroom_name: 'IoT & Embedded Systems Lab (CR-204)',
    incident_type: 'short_circuit',
    severity: 'critical',
    status: 'open',
    power_cut_applied: true,
    title: 'Arc Fault / Short Circuit on Branch Circuit 2',
    description: 'Instantaneous current spike of 95 Amps detected on lighting rail. Automated circuit trip executed.',
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
];

export async function GET() {
  const room = deviceSimulator.getAllClassrooms()[0];
  if (room && room.isBreakerTripped) {
    if (!liveIncidents.some((i) => i.id === 'inc-current-tripped' && i.status === 'open')) {
      liveIncidents.unshift({
        id: 'inc-current-tripped',
        classroom_id: room.classroomId,
        classroom_name: room.name,
        incident_type: 'breaker_trip',
        severity: 'critical',
        status: 'open',
        power_cut_applied: true,
        title: 'Emergency Breaker Tripped - Zero Power',
        description: 'Classroom circuit breaker has been tripped to protect equipment and prevent electrical fire.',
        created_at: new Date().toISOString(),
      });
    }
  }

  return NextResponse.json({ incidents: liveIncidents });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = CreateIncidentSchema.parse(body);

    const result = await EmergencyIncidentService.raiseEmergency({
      classroomId: validated.classroom_id,
      blockId: 'b1000000-0000-0000-0000-000000000001',
      zoneId: validated.zone_id,
      deviceId: validated.device_id,
      incidentType: validated.incident_type,
      severity: validated.severity,
      title: validated.title,
      description: validated.description,
      telemetrySnapshot: validated.telemetry_snapshot,
      tripPowerImmediately: validated.trip_power_immediately,
    });

    const newInc = {
      id: result.incidentId,
      classroom_id: validated.classroom_id,
      classroom_name: 'IoT & Embedded Systems Lab (CR-204)',
      incident_type: validated.incident_type,
      severity: validated.severity,
      status: 'open',
      power_cut_applied: result.powerCutApplied,
      title: validated.title,
      description: validated.description,
      created_at: new Date().toISOString(),
    };

    liveIncidents.unshift(newInc);

    return NextResponse.json({ success: true, incident: newInc }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

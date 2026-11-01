import { NextRequest, NextResponse } from 'next/server';
import { EmergencyIncidentService } from '@/lib/emergency/service';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const actorId = body.actor_id || 'staff-tech-1';
  const notes = body.notes || 'Acknowledged by technician on duty. Heading to classroom for inspection.';

  await EmergencyIncidentService.acknowledgeIncident(id, actorId, notes);

  return NextResponse.json({
    success: true,
    incident_id: id,
    status: 'acknowledged',
    acknowledged_at: new Date().toISOString(),
    notes,
  });
}

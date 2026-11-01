import { NextRequest, NextResponse } from 'next/server';
import { EnergyAnalyticsService } from '@/lib/energy/aggregation';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const period = searchParams.get('period') || 'today';

  // Seed sample 24-hour interval records for analytical representation
  const sampleRecords = [
    { hour: '08:00', classroomId: 'c204', classroomName: 'CR-204 (IoT Lab)', actualKwh: 0.8, baselineKwh: 1.8, occupancy: 5 },
    { hour: '09:00', classroomId: 'c204', classroomName: 'CR-204 (IoT Lab)', actualKwh: 1.4, baselineKwh: 2.6, occupancy: 28 },
    { hour: '10:00', classroomId: 'c204', classroomName: 'CR-204 (IoT Lab)', actualKwh: 1.5, baselineKwh: 2.6, occupancy: 30 },
    { hour: '11:00', classroomId: 'c204', classroomName: 'CR-204 (IoT Lab)', actualKwh: 1.2, baselineKwh: 2.6, occupancy: 25 },
    { hour: '12:00', classroomId: 'c204', classroomName: 'CR-204 (IoT Lab)', actualKwh: 0.3, baselineKwh: 1.8, occupancy: 0 },
    { hour: '13:00', classroomId: 'c204', classroomName: 'CR-204 (IoT Lab)', actualKwh: 0.2, baselineKwh: 1.8, occupancy: 0 },
    { hour: '14:00', classroomId: 'c204', classroomName: 'CR-204 (IoT Lab)', actualKwh: 1.3, baselineKwh: 2.6, occupancy: 22 },
    { hour: '15:00', classroomId: 'c204', classroomName: 'CR-204 (IoT Lab)', actualKwh: 0.9, baselineKwh: 2.6, occupancy: 12 },
    { hour: '16:00', classroomId: 'c204', classroomName: 'CR-204 (IoT Lab)', actualKwh: 0.5, baselineKwh: 2.0, occupancy: 4 },
    { hour: '17:00', classroomId: 'c204', classroomName: 'CR-204 (IoT Lab)', actualKwh: 0.1, baselineKwh: 1.5, occupancy: 0 },
  ];

  const metrics = EnergyAnalyticsService.computeMetrics(sampleRecords);

  return NextResponse.json({
    period,
    metrics,
    generated_at: new Date().toISOString(),
  });
}

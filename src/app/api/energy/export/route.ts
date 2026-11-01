import { NextResponse } from 'next/server';
import { EnergyAnalyticsService } from '@/lib/energy/aggregation';

export async function GET() {
  const sampleRecords = [
    { hour: '08:00', classroomId: 'c204', classroomName: 'CR-204 (IoT Lab)', actualKwh: 0.8, baselineKwh: 1.8, occupancy: 5 },
    { hour: '09:00', classroomId: 'c204', classroomName: 'CR-204 (IoT Lab)', actualKwh: 1.4, baselineKwh: 2.6, occupancy: 28 },
    { hour: '10:00', classroomId: 'c204', classroomName: 'CR-204 (IoT Lab)', actualKwh: 1.5, baselineKwh: 2.6, occupancy: 30 },
    { hour: '11:00', classroomId: 'c204', classroomName: 'CR-204 (IoT Lab)', actualKwh: 1.2, baselineKwh: 2.6, occupancy: 25 },
    { hour: '12:00', classroomId: 'c204', classroomName: 'CR-204 (IoT Lab)', actualKwh: 0.3, baselineKwh: 1.8, occupancy: 0 },
    { hour: '13:00', classroomId: 'c204', classroomName: 'CR-204 (IoT Lab)', actualKwh: 0.2, baselineKwh: 1.8, occupancy: 0 },
    { hour: '14:00', classroomId: 'c204', classroomName: 'CR-204 (IoT Lab)', actualKwh: 1.3, baselineKwh: 2.6, occupancy: 22 },
  ];

  const metrics = EnergyAnalyticsService.computeMetrics(sampleRecords);
  const csvData = EnergyAnalyticsService.exportToCSV(metrics);

  return new NextResponse(csvData, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="eco_class_energy_report_${Date.now()}.csv"`,
    },
  });
}

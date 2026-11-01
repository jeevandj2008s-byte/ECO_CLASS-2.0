export interface EnergySummaryItem {
  id: string;
  name: string;
  code?: string;
  actualKwh: number;
  baselineKwh: number;
  savedKwh: number;
  costSaved: number;
  co2SavedKg: number;
  occupancyAvg: number;
}

export interface EnergyMetrics {
  totalActualKwh: number;
  totalBaselineKwh: number;
  totalSavedKwh: number;
  totalCostSaved: number;
  totalCo2SavedKg: number;
  savingsPercentage: number;
  peakHour: { hour: number; kwh: number };
  topWasters: Array<{ classroomId: string; name: string; wastedKwh: number }>;
  hourlyBreakdown: Array<{
    hour: string;
    actualKwh: number;
    baselineKwh: number;
    savedKwh: number;
    occupancy: number;
  }>;
}

export class EnergyAnalyticsService {
  /**
   * Computes energy metrics from raw hourly interval rows
   */
  static computeMetrics(
    records: Array<{
      hour: string;
      classroomId: string;
      classroomName?: string;
      actualKwh: number;
      baselineKwh: number;
      occupancy: number;
      costPerKwh?: number;
      co2PerKwh?: number;
    }>
  ): EnergyMetrics {
    const costFactor = 0.15; // $0.15 / kWh
    const co2Factor = 0.82; // 0.82 kg CO2 / kWh

    let totalActual = 0;
    let totalBaseline = 0;

    const hourlyMap = new Map<string, { actual: number; baseline: number; occSum: number; count: number }>();
    const roomWasterMap = new Map<string, { name: string; actual: number; baseline: number }>();

    for (const r of records) {
      totalActual += r.actualKwh;
      totalBaseline += r.baselineKwh;

      // Hourly aggregation
      const existingH = hourlyMap.get(r.hour) || { actual: 0, baseline: 0, occSum: 0, count: 0 };
      existingH.actual += r.actualKwh;
      existingH.baseline += r.baselineKwh;
      existingH.occSum += r.occupancy;
      existingH.count += 1;
      hourlyMap.set(r.hour, existingH);

      // Room tracking
      const existingR = roomWasterMap.get(r.classroomId) || {
        name: r.classroomName || r.classroomId,
        actual: 0,
        baseline: 0,
      };
      existingR.actual += r.actualKwh;
      existingR.baseline += r.baselineKwh;
      roomWasterMap.set(r.classroomId, existingR);
    }

    const totalSaved = Math.max(0, totalBaseline - totalActual);
    const savingsPercentage = totalBaseline > 0 ? (totalSaved / totalBaseline) * 100 : 0;

    // Peak hour
    let peakHour = { hour: 0, kwh: 0 };
    const hourlyBreakdown = Array.from(hourlyMap.entries()).map(([hour, val]) => {
      const saved = Math.max(0, val.baseline - val.actual);
      const hourNum = parseInt(hour.split(':')[0], 10) || 0;
      if (val.actual > peakHour.kwh) {
        peakHour = { hour: hourNum, kwh: val.actual };
      }
      return {
        hour,
        actualKwh: Number(val.actual.toFixed(2)),
        baselineKwh: Number(val.baseline.toFixed(2)),
        savedKwh: Number(saved.toFixed(2)),
        occupancy: Math.round(val.occSum / Math.max(1, val.count)),
      };
    });

    // Top wasters: highest actual consumption
    const topWasters = Array.from(roomWasterMap.entries())
      .map(([id, item]) => ({
        classroomId: id,
        name: item.name,
        wastedKwh: Number(item.actual.toFixed(2)),
      }))
      .sort((a, b) => b.wastedKwh - a.wastedKwh)
      .slice(0, 5);

    return {
      totalActualKwh: Number(totalActual.toFixed(2)),
      totalBaselineKwh: Number(totalBaseline.toFixed(2)),
      totalSavedKwh: Number(totalSaved.toFixed(2)),
      totalCostSaved: Number((totalSaved * costFactor).toFixed(2)),
      totalCo2SavedKg: Number((totalSaved * co2Factor).toFixed(2)),
      savingsPercentage: Number(savingsPercentage.toFixed(1)),
      peakHour,
      topWasters,
      hourlyBreakdown,
    };
  }

  /**
   * Generates CSV format for download / reporting
   */
  static exportToCSV(metrics: EnergyMetrics): string {
    const lines = [
      'Eco Class Energy Conservation Report',
      `Generated At,${new Date().toISOString()}`,
      `Total Actual kWh,${metrics.totalActualKwh}`,
      `Total Baseline kWh,${metrics.totalBaselineKwh}`,
      `Total Saved kWh,${metrics.totalSavedKwh}`,
      `Energy Saved (%),${metrics.savingsPercentage}%`,
      `Cost Saved ($),${metrics.totalCostSaved}`,
      `CO2 Avoided (kg),${metrics.totalCo2SavedKg}`,
      '',
      'Hourly Breakdown',
      'Hour,Actual (kWh),Baseline (kWh),Saved (kWh),Avg Occupancy',
      ...metrics.hourlyBreakdown.map(
        (h) => `${h.hour},${h.actualKwh},${h.baselineKwh},${h.savedKwh},${h.occupancy}`
      ),
      '',
      'Top Consuming Classrooms',
      'Classroom ID,Name,Consumed (kWh)',
      ...metrics.topWasters.map((w) => `${w.classroomId},${w.name},${w.wastedKwh}`),
    ];

    return lines.join('\n');
  }
}

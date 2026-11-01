'use client';

import { useEffect, useState } from 'react';

export default function EnergyDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [period, setPeriod] = useState('today');

  useEffect(() => {
    fetch(`/api/energy/stats?period=${period}`)
      .then((res) => res.json())
      .then((data) => setStats(data.metrics))
      .catch((err) => console.error(err));
  }, [period]);

  const handleExportCSV = () => {
    window.location.href = '/api/energy/export';
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: '0 0 4px 0' }}>Campus Energy Conservation Dashboard</h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
            Baseline Comparison, Carbon Footprint &amp; Consumption Analytics
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          >
            <option value="today">Today (Hourly)</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <button
            onClick={handleExportCSV}
            style={{ padding: '8px 16px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}
          >
            Export CSV Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>ACTUAL CONSUMPTION</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a' }}>{stats?.totalActualKwh || 0} kWh</div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>With Eco Class zone dimming</div>
        </div>

        <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>UNMANAGED BASELINE</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#64748b' }}>{stats?.totalBaselineKwh || 0} kWh</div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Legacy unmanaged classrooms</div>
        </div>

        <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', border: '2px solid #22c55e' }}>
          <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 'bold', marginBottom: '4px' }}>TOTAL ENERGY SAVED</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>
            {stats?.totalSavedKwh || 0} kWh ({stats?.savingsPercentage || 0}%)
          </div>
          <div style={{ fontSize: '12px', color: '#16a34a', marginTop: '4px' }}>Significant peak load reduction</div>
        </div>

        <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>COST &amp; CARBON AVOIDED</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a' }}>${stats?.totalCostSaved || 0}</div>
          <div style={{ fontSize: '12px', color: '#16a34a', marginTop: '4px' }}>🌱 {stats?.totalCo2SavedKg || 0} kg CO₂ reduced</div>
        </div>
      </div>

      {/* Hourly Breakdown Table */}
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Hourly Consumption vs Baseline</h3>
        <table>
          <thead>
            <tr>
              <th>Hour</th>
              <th>Actual Draw (kWh)</th>
              <th>Baseline Draw (kWh)</th>
              <th>Energy Saved (kWh)</th>
              <th>Avg Occupants</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {stats?.hourlyBreakdown?.map((h: any) => (
              <tr key={h.hour}>
                <td><strong>{h.hour}</strong></td>
                <td>{h.actualKwh} kWh</td>
                <td>{h.baselineKwh} kWh</td>
                <td style={{ color: '#16a34a', fontWeight: 'bold' }}>+{h.savedKwh} kWh</td>
                <td>{h.occupancy} people</td>
                <td>
                  <span style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '4px', background: h.savedKwh > 1.0 ? '#dcfce7' : '#f1f5f9', color: h.savedKwh > 1.0 ? '#15803d' : '#475569' }}>
                    {h.savedKwh > 1.0 ? 'High Conservation' : 'Normal'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

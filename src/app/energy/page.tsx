'use client';

import { useEffect, useState } from 'react';
import { Download, Zap, TrendingDown, Leaf, IndianRupee } from 'lucide-react';
import { CAMPUS_CONFIG, formatCurrencyINR } from '@/lib/config/campus';

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
    <div style={{ margin: '40px 0', position: 'relative', zIndex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="eyebrow-badge" style={{ marginBottom: '10px' }}>
            <span>TELEMETRY &amp; CARBON ACCOUNTING</span>
          </div>
          <h1 style={{ margin: '0 0 6px 0', fontSize: '32px', fontWeight: 200, letterSpacing: '-0.025em', color: '#fff' }}>
            Campus Energy Dashboard
          </h1>
          <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.45)', fontSize: '14px', fontWeight: 300 }}>
            Unmanaged Baseline vs Zone-Optimized Consumption &bull; {CAMPUS_CONFIG.collegeShortName} Main Campus
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={{
              padding: '10px 16px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: '#080814',
              color: '#fff',
              fontSize: '13px',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <option value="today">Today (Hourly View)</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <button
            onClick={handleExportCSV}
            className="strata-btn-primary"
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 500,
            }}
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="strata-card-wrapper">
          <div className="strata-card-aura" />
          <div className="strata-card-inner" style={{ padding: '24px' }}>
            <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'rgba(255, 255, 255, 0.35)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.08em' }}>
              ACTUAL CONSUMPTION
            </div>
            <div className="mono-telemetry" style={{ fontSize: '32px', fontWeight: 200, color: '#fff' }}>
              {stats?.totalActualKwh || 0} kWh
            </div>
            <div style={{ fontSize: '12px', fontWeight: 300, color: '#c4b5fd', marginTop: '8px' }}>
              Active daylight dimming &amp; grace cutoffs
            </div>
          </div>
        </div>

        <div className="strata-card-wrapper">
          <div className="strata-card-aura" />
          <div className="strata-card-inner" style={{ padding: '24px' }}>
            <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'rgba(255, 255, 255, 0.35)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.08em' }}>
              UNMANAGED BASELINE
            </div>
            <div className="mono-telemetry" style={{ fontSize: '32px', fontWeight: 200, color: 'rgba(255, 255, 255, 0.35)' }}>
              {stats?.totalBaselineKwh || 0} kWh
            </div>
            <div style={{ fontSize: '12px', fontWeight: 300, color: 'rgba(255, 255, 255, 0.35)', marginTop: '8px' }}>
              Conventional fixtures left running
            </div>
          </div>
        </div>

        <div className="strata-card-wrapper">
          <div className="strata-card-aura" />
          <div className="strata-card-inner" style={{ padding: '24px' }}>
            <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: '#a78bfa', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.08em', fontWeight: 500 }}>
              NET SAVED ENERGY
            </div>
            <div className="mono-telemetry gradient-text-stat" style={{ fontSize: '32px', fontWeight: 200 }}>
              {stats?.totalSavedKwh || 0} kWh ({stats?.savingsPercentage || 0}%)
            </div>
            <div style={{ fontSize: '12px', fontWeight: 300, color: '#fff', marginTop: '8px' }}>
              Significant peak-load abatement
            </div>
          </div>
        </div>

        <div className="strata-card-wrapper">
          <div className="strata-card-aura" />
          <div className="strata-card-inner" style={{ padding: '24px' }}>
            <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'rgba(255, 255, 255, 0.35)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.08em' }}>
              RUPEE &amp; CO₂ IMPACT
            </div>
            <div className="mono-telemetry" style={{ fontSize: '28px', fontWeight: 200, color: '#fff' }}>
              ₹{((stats?.totalSavedKwh || 0) * CAMPUS_CONFIG.tariffINRPerKWh).toFixed(2)}
            </div>
            <div style={{ fontSize: '12px', fontWeight: 300, color: '#c4b5fd', marginTop: '8px' }}>
              🌱 {stats?.totalCo2SavedKg || 0} kg CO₂ avoided
            </div>
          </div>
        </div>
      </div>

      {/* Hourly Breakdown Table */}
      <div className="strata-card-wrapper">
        <div className="strata-card-aura" />
        <div className="strata-card-inner" style={{ padding: '28px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 400, letterSpacing: '-0.01em', color: '#fff', margin: '0 0 20px 0' }}>
            Hourly Interval Log vs Baseline
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: 'rgba(255, 255, 255, 0.4)' }}>
                  <th style={{ padding: '12px 14px', background: 'transparent', fontWeight: 400 }}>Hour Bucket</th>
                  <th style={{ padding: '12px 14px', background: 'transparent', fontWeight: 400 }}>Actual (kWh)</th>
                  <th style={{ padding: '12px 14px', background: 'transparent', fontWeight: 400 }}>Baseline (kWh)</th>
                  <th style={{ padding: '12px 14px', background: 'transparent', fontWeight: 400 }}>Saved (kWh)</th>
                  <th style={{ padding: '12px 14px', background: 'transparent', fontWeight: 400 }}>Cost Saved (₹)</th>
                  <th style={{ padding: '12px 14px', background: 'transparent', fontWeight: 400 }}>Occupancy</th>
                  <th style={{ padding: '12px 14px', background: 'transparent', fontWeight: 400 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats?.hourlyBreakdown?.map((h: any) => (
                  <tr key={h.hour} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', color: 'rgba(255, 255, 255, 0.85)' }}>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{h.hour}</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>{h.actualKwh} kWh</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', color: 'rgba(255, 255, 255, 0.35)' }}>{h.baselineKwh} kWh</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', color: '#c4b5fd', fontWeight: 500 }}>+{h.savedKwh} kWh</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', color: '#fff' }}>₹{(h.savedKwh * CAMPUS_CONFIG.tariffINRPerKWh).toFixed(2)}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 300 }}>{h.occupancy} students</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          background: h.savedKwh > 1.0 ? 'rgba(124, 58, 237, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                          color: h.savedKwh > 1.0 ? '#c4b5fd' : 'rgba(255, 255, 255, 0.35)',
                          border: `1px solid ${h.savedKwh > 1.0 ? 'rgba(124, 58, 237, 0.3)' : 'transparent'}`,
                          fontWeight: 500,
                        }}
                      >
                        {h.savedKwh > 1.0 ? 'High Conservation' : 'Normal'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

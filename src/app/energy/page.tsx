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
    <div style={{ margin: '32px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="eyebrow-badge" style={{ marginBottom: '8px' }}>
            <span>TELEMETRY &amp; CARBON ACCOUNTING</span>
          </div>
          <h1 style={{ margin: '0 0 6px 0', fontSize: '30px', fontWeight: 800, color: '#fff' }}>
            Campus Energy Dashboard
          </h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>
            Unmanaged Baseline vs Zone-Optimized Consumption &bull; {CAMPUS_CONFIG.collegeShortName} Main Campus
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-medium)',
              background: 'var(--bg-surface)',
              color: '#fff',
              fontSize: '13px',
            }}
          >
            <option value="today">Today (Hourly View)</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <button
            onClick={handleExportCSV}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 18px',
              background: 'var(--accent-violet)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: 'var(--glow-violet)',
            }}
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.08em' }}>
            ACTUAL CONSUMPTION
          </div>
          <div className="mono-telemetry" style={{ fontSize: '32px', fontWeight: 800, color: '#fff' }}>
            {stats?.totalActualKwh || 0} kWh
          </div>
          <div style={{ fontSize: '12px', color: 'var(--accent-mint)', marginTop: '8px' }}>
            Active daylight dimming &amp; grace cutoffs
          </div>
        </div>

        <div style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.08em' }}>
            UNMANAGED BASELINE
          </div>
          <div className="mono-telemetry" style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-muted)' }}>
            {stats?.totalBaselineKwh || 0} kWh
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
            Conventional fixtures left running
          </div>
        </div>

        <div style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-mint)', boxShadow: '0 0 24px rgba(126, 232, 214, 0.1)' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent-mint)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.08em', fontWeight: 700 }}>
            NET SAVED ENERGY
          </div>
          <div className="mono-telemetry" style={{ fontSize: '32px', fontWeight: 800, color: 'var(--accent-mint)' }}>
            {stats?.totalSavedKwh || 0} kWh ({stats?.savingsPercentage || 0}%)
          </div>
          <div style={{ fontSize: '12px', color: '#fff', marginTop: '8px' }}>
            Significant peak-load abatement
          </div>
        </div>

        <div style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.08em' }}>
            RUPEE &amp; CO₂ IMPACT
          </div>
          <div className="mono-telemetry" style={{ fontSize: '28px', fontWeight: 800, color: '#fff' }}>
            ₹{((stats?.totalSavedKwh || 0) * CAMPUS_CONFIG.tariffINRPerKWh).toFixed(2)}
          </div>
          <div style={{ fontSize: '12px', color: '#34d399', marginTop: '8px' }}>
            🌱 {stats?.totalCo2SavedKg || 0} kg CO₂ avoided
          </div>
        </div>
      </div>

      {/* Hourly Breakdown Table */}
      <div style={{ background: 'var(--bg-surface)', padding: '28px', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: '0 0 20px 0' }}>
          Hourly Interval Log vs Baseline
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 14px', background: 'transparent' }}>Hour Bucket</th>
                <th style={{ padding: '12px 14px', background: 'transparent' }}>Actual (kWh)</th>
                <th style={{ padding: '12px 14px', background: 'transparent' }}>Baseline (kWh)</th>
                <th style={{ padding: '12px 14px', background: 'transparent' }}>Saved (kWh)</th>
                <th style={{ padding: '12px 14px', background: 'transparent' }}>Cost Saved (₹)</th>
                <th style={{ padding: '12px 14px', background: 'transparent' }}>Occupancy</th>
                <th style={{ padding: '12px 14px', background: 'transparent' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats?.hourlyBreakdown?.map((h: any) => (
                <tr key={h.hour} style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{h.hour}</td>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>{h.actualKwh} kWh</td>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{h.baselineKwh} kWh</td>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', color: 'var(--accent-mint)', fontWeight: 700 }}>+{h.savedKwh} kWh</td>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', color: '#fff' }}>₹{(h.savedKwh * CAMPUS_CONFIG.tariffINRPerKWh).toFixed(2)}</td>
                  <td style={{ padding: '12px 14px' }}>{h.occupancy} students</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        background: h.savedKwh > 1.0 ? 'var(--accent-mint-subtle)' : 'rgba(255,255,255,0.05)',
                        color: h.savedKwh > 1.0 ? 'var(--accent-mint)' : 'var(--text-muted)',
                        fontWeight: 600,
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
  );
}

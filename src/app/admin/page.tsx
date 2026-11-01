'use client';

import { useEffect, useState } from 'react';
import { Sliders, Shield, Users, Save, CheckCircle } from 'lucide-react';
import { CAMPUS_CONFIG } from '@/lib/config/campus';

export default function AdminPage() {
  const [rule, setRule] = useState<any>({
    target_lux: 400,
    lux_hysteresis: 30,
    temp_fan_threshold: 26.5,
    empty_grace_period_seconds: 300,
  });
  const [allowEmail, setAllowEmail] = useState('');
  const [allowRole, setAllowRole] = useState('worker');
  const [allowlist, setAllowlist] = useState<any[]>([
    { email: 'director@bit-bangalore.edu.in', role: 'admin', dept: 'Executive Office' },
    { email: 'hod.cse@bit-bangalore.edu.in', role: 'hod', dept: 'CSE Department' },
    { email: 'raju.facilities@bit-bangalore.edu.in', role: 'worker', dept: 'Electrical Maintenance' },
  ]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/automation/rules')
      .then((res) => res.json())
      .then((data) => {
        if (data.rule) setRule(data.rule);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSaveRule = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('Updating campus automation parameters...');
    try {
      const res = await fetch('/api/automation/rules', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_lux: Number(rule.target_lux),
          lux_hysteresis: Number(rule.lux_hysteresis),
          temp_fan_threshold: Number(rule.temp_fan_threshold),
          empty_grace_period_seconds: Number(rule.empty_grace_period_seconds),
        }),
      });
      const data = await res.json();
      setRule(data.rule);
      setMsg('Global automation thresholds updated and version incremented.');
    } catch (err: any) {
      setMsg(`Error: ${err.message}`);
    }
  };

  const handleAddAllowlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allowEmail) return;
    setAllowlist((prev) => [...prev, { email: allowEmail, role: allowRole, dept: 'Academic Faculty' }]);
    setAllowEmail('');
    setMsg(`Added ${allowEmail} as pre-approved ${allowRole.toUpperCase()} on Google Login.`);
  };

  return (
    <div style={{ margin: '32px 0' }}>
      <div style={{ marginBottom: '28px' }}>
        <div className="eyebrow-badge" style={{ marginBottom: '8px' }}>
          <span>ADMINISTRATION &bull; ACCESS CONTROL</span>
        </div>
        <h1 style={{ margin: '0 0 6px 0', fontSize: '30px', fontWeight: 800, color: '#fff' }}>
          Campus Policy &amp; User Governance
        </h1>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>
          Manage global automation thresholds, staff role delegation, and pre-approved Google login accounts.
        </p>
      </div>

      {msg && (
        <div style={{ padding: '12px 16px', background: 'var(--bg-surface)', border: '1px solid var(--border-mint)', color: 'var(--accent-mint)', borderRadius: '8px', marginBottom: '24px', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
          {msg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
        {/* Automation Thresholds Form */}
        <div style={{ background: 'var(--bg-surface)', padding: '28px', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>Campus Automation Rules</h2>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent-mint)' }}>
              Profile v{rule.version || 1}
            </span>
          </div>

          <form onSubmit={handleSaveRule}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Study Target Brightness (Lux):
              </label>
              <input
                type="number"
                value={rule.target_lux || 400}
                onChange={(e) => setRule({ ...rule, target_lux: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-medium)', background: 'var(--bg-surface-elevated)', color: '#fff', fontSize: '13px' }}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Lux Hysteresis Anti-Flicker Band (Lux):
              </label>
              <input
                type="number"
                value={rule.lux_hysteresis || 30}
                onChange={(e) => setRule({ ...rule, lux_hysteresis: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-medium)', background: 'var(--bg-surface-elevated)', color: '#fff', fontSize: '13px' }}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Fan Cooling Activation Threshold (°C):
              </label>
              <input
                type="number"
                step="0.1"
                value={rule.temp_fan_threshold || 26.5}
                onChange={(e) => setRule({ ...rule, temp_fan_threshold: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-medium)', background: 'var(--bg-surface-elevated)', color: '#fff', fontSize: '13px' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Empty Room Grace Period (Seconds):
              </label>
              <input
                type="number"
                value={rule.empty_grace_period_seconds || 300}
                onChange={(e) => setRule({ ...rule, empty_grace_period_seconds: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-medium)', background: 'var(--bg-surface-elevated)', color: '#fff', fontSize: '13px' }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--accent-violet)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: 'var(--glow-violet)',
              }}
            >
              Update Policy Thresholds
            </button>
          </form>
        </div>

        {/* Email Allowlist Form */}
        <div style={{ background: 'var(--bg-surface)', padding: '28px', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: '0 0 8px 0' }}>Admin Email Allowlist</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 20px 0', lineHeight: 1.5 }}>
            Pre-approved staff emails automatically receive elevated roles on Google Workspace sign-in.
          </p>

          <form onSubmit={handleAddAllowlist} style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <input
              type="email"
              placeholder="dean.engineering@bit-bangalore.edu.in"
              value={allowEmail}
              onChange={(e) => setAllowEmail(e.target.value)}
              required
              style={{ flex: 1, minWidth: '180px', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-medium)', background: 'var(--bg-surface-elevated)', color: '#fff', fontSize: '13px' }}
            />
            <select
              value={allowRole}
              onChange={(e) => setAllowRole(e.target.value)}
              style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-medium)', background: 'var(--bg-surface-elevated)', color: '#fff', fontSize: '13px' }}
            >
              <option value="worker">Worker</option>
              <option value="hod">HOD</option>
              <option value="admin">Admin</option>
            </select>
            <button
              type="submit"
              style={{ padding: '10px 18px', background: 'var(--accent-mint)', color: '#0b0b10', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
            >
              Authorize
            </button>
          </form>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '12px', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '8px', background: 'transparent' }}>Email</th>
                  <th style={{ padding: '8px', background: 'transparent' }}>Role</th>
                  <th style={{ padding: '8px', background: 'transparent' }}>Department</th>
                </tr>
              </thead>
              <tbody>
                {allowlist.map((u, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}>
                    <td style={{ padding: '10px 8px', fontFamily: 'var(--font-mono)' }}>{u.email}</td>
                    <td style={{ padding: '10px 8px' }}>
                      <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', padding: '2px 6px', borderRadius: '4px', background: 'var(--accent-violet-subtle)', color: '#c4b5fd', border: '1px solid var(--border-violet)', textTransform: 'uppercase', fontWeight: 700 }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '10px 8px', color: 'var(--text-secondary)' }}>{u.dept}</td>
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

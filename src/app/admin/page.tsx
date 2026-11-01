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
    <div style={{ margin: '40px 0', position: 'relative', zIndex: 1 }}>
      <div style={{ marginBottom: '32px' }}>
        <div className="eyebrow-badge" style={{ marginBottom: '10px' }}>
          <span>ADMINISTRATION &bull; ACCESS CONTROL</span>
        </div>
        <h1 style={{ margin: '0 0 6px 0', fontSize: '32px', fontWeight: 200, letterSpacing: '-0.025em', color: '#fff' }}>
          Campus Policy &amp; User Governance
        </h1>
        <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.45)', fontSize: '14px', fontWeight: 300 }}>
          Manage global automation thresholds, staff role delegation, and pre-approved Google login accounts.
        </p>
      </div>

      {msg && (
        <div
          style={{
            padding: '12px 18px',
            background: 'rgba(124, 58, 237, 0.12)',
            border: '1px solid rgba(124, 58, 237, 0.3)',
            color: '#c4b5fd',
            borderRadius: '10px',
            marginBottom: '24px',
            fontSize: '13px',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {msg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
        {/* Automation Thresholds Form */}
        <div className="strata-card-wrapper">
          <div className="strata-card-aura" />
          <div className="strata-card-inner" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 400, color: '#fff', margin: 0 }}>Campus Automation Rules</h2>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#c4b5fd' }}>
                Profile v{rule.version || 1}
              </span>
            </div>

            <form onSubmit={handleSaveRule}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 400, color: 'rgba(255, 255, 255, 0.55)', marginBottom: '6px' }}>
                  Study Target Brightness (Lux):
                </label>
                <input
                  type="number"
                  value={rule.target_lux || 400}
                  onChange={(e) => setRule({ ...rule, target_lux: e.target.value })}
                  className="strata-input"
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 400, color: 'rgba(255, 255, 255, 0.55)', marginBottom: '6px' }}>
                  Lux Hysteresis Anti-Flicker Band (Lux):
                </label>
                <input
                  type="number"
                  value={rule.lux_hysteresis || 30}
                  onChange={(e) => setRule({ ...rule, lux_hysteresis: e.target.value })}
                  className="strata-input"
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 400, color: 'rgba(255, 255, 255, 0.55)', marginBottom: '6px' }}>
                  Fan Cooling Activation Threshold (°C):
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={rule.temp_fan_threshold || 26.5}
                  onChange={(e) => setRule({ ...rule, temp_fan_threshold: e.target.value })}
                  className="strata-input"
                />
              </div>

              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 400, color: 'rgba(255, 255, 255, 0.55)', marginBottom: '6px' }}>
                  Empty Room Grace Period (Seconds):
                </label>
                <input
                  type="number"
                  value={rule.empty_grace_period_seconds || 300}
                  onChange={(e) => setRule({ ...rule, empty_grace_period_seconds: e.target.value })}
                  className="strata-input"
                />
              </div>

              <button
                type="submit"
                className="strata-btn-primary"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 'var(--radius-pill)',
                }}
              >
                Update Policy Thresholds
              </button>
            </form>
          </div>
        </div>

        {/* Email Allowlist Form */}
        <div className="strata-card-wrapper">
          <div className="strata-card-aura" />
          <div className="strata-card-inner" style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 400, color: '#fff', margin: '0 0 8px 0' }}>Admin Email Allowlist</h2>
            <p style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(255, 255, 255, 0.45)', margin: '0 0 20px 0', lineHeight: 1.5 }}>
              Pre-approved staff emails automatically receive elevated roles on Google Workspace sign-in.
            </p>

            <form onSubmit={handleAddAllowlist} style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <input
                type="email"
                placeholder="dean.engineering@bit-bangalore.edu.in"
                value={allowEmail}
                onChange={(e) => setAllowEmail(e.target.value)}
                required
                className="strata-input"
                style={{ flex: 1, minWidth: '180px' }}
              />
              <select
                value={allowRole}
                onChange={(e) => setAllowRole(e.target.value)}
                className="strata-input"
                style={{ width: 'auto' }}
              >
                <option value="worker">Worker</option>
                <option value="hod">HOD</option>
                <option value="admin">Admin</option>
              </select>
              <button
                type="submit"
                className="strata-btn-primary"
                style={{ padding: '10px 18px', fontSize: '13px' }}
              >
                Authorize
              </button>
            </form>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', fontSize: '12px', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: 'rgba(255, 255, 255, 0.4)' }}>
                    <th style={{ padding: '10px 8px', background: 'transparent', fontWeight: 400 }}>Email</th>
                    <th style={{ padding: '10px 8px', background: 'transparent', fontWeight: 400 }}>Role</th>
                    <th style={{ padding: '10px 8px', background: 'transparent', fontWeight: 400 }}>Department</th>
                  </tr>
                </thead>
                <tbody>
                  {allowlist.map((u, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', color: 'rgba(255, 255, 255, 0.85)' }}>
                      <td style={{ padding: '12px 8px', fontFamily: 'var(--font-mono)' }}>{u.email}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', padding: '2px 8px', borderRadius: '4px', background: 'rgba(124, 58, 237, 0.14)', color: '#c4b5fd', border: '1px solid rgba(124, 58, 237, 0.3)', textTransform: 'uppercase', fontWeight: 500 }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px', color: 'rgba(255, 255, 255, 0.45)', fontWeight: 300 }}>{u.dept}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

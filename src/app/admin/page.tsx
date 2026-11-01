'use client';

import { useEffect, useState } from 'react';

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
    { email: 'hod.cse@ecoclass.edu', role: 'hod', dept: 'CSE' },
    { email: 'technician.raj@ecoclass.edu', role: 'worker', dept: 'Facilities' },
    { email: 'admin@ecoclass.campus.edu', role: 'admin', dept: 'IT Admin' },
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
    setMsg('Updating automation rules across campus...');
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
      setMsg('Automation thresholds updated and version incremented.');
    } catch (err: any) {
      setMsg(`Error: ${err.message}`);
    }
  };

  const handleAddAllowlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allowEmail) return;
    setAllowlist((prev) => [...prev, { email: allowEmail, role: allowRole, dept: 'Engineering' }]);
    setAllowEmail('');
    setMsg(`Added ${allowEmail} as pre-approved ${allowRole}.`);
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 4px 0' }}>⚙️ Administration &amp; Campus Policy Control</h2>
        <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
          Role Management &bull; Admin Email Allowlist &bull; Automation Rules Configuration
        </p>
      </div>

      {msg && (
        <div style={{ padding: '12px', background: '#ecfdf5', color: '#065f46', borderRadius: '6px', marginBottom: '20px', fontSize: '14px' }}>
          {msg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Rules Editor */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Campus Automation Thresholds</h3>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0' }}>
            Version: <strong>{rule.version || 1}</strong> &bull; Changes apply deterministically to all classrooms.
          </p>

          <form onSubmit={handleSaveRule}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
                Study Target Brightness (Lux):
              </label>
              <input
                type="number"
                value={rule.target_lux || 400}
                onChange={(e) => setRule({ ...rule, target_lux: e.target.value })}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
                Lux Hysteresis Anti-Flicker Band (Lux):
              </label>
              <input
                type="number"
                value={rule.lux_hysteresis || 30}
                onChange={(e) => setRule({ ...rule, lux_hysteresis: e.target.value })}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
                Fan Cooling Activation Threshold (°C):
              </label>
              <input
                type="number"
                step="0.1"
                value={rule.temp_fan_threshold || 26.5}
                onChange={(e) => setRule({ ...rule, temp_fan_threshold: e.target.value })}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
                Empty Room Grace Period (Seconds):
              </label>
              <input
                type="number"
                value={rule.empty_grace_period_seconds || 300}
                onChange={(e) => setRule({ ...rule, empty_grace_period_seconds: e.target.value })}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <button
              type="submit"
              style={{ width: '100%', padding: '10px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}
            >
              Update Policy
            </button>
          </form>
        </div>

        {/* Email Allowlist & Role Delegation */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Admin Email Allowlist</h3>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0' }}>
            Pre-approved staff emails automatically get elevated roles on Google OAuth login.
          </p>

          <form onSubmit={handleAddAllowlist} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <input
              type="email"
              placeholder="faculty@ecoclass.edu"
              value={allowEmail}
              onChange={(e) => setAllowEmail(e.target.value)}
              required
              style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
            />
            <select
              value={allowRole}
              onChange={(e) => setAllowRole(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
            >
              <option value="worker">Worker</option>
              <option value="hod">HOD</option>
              <option value="admin">Admin</option>
            </select>
            <button
              type="submit"
              style={{ padding: '8px 16px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}
            >
              Add
            </button>
          </form>

          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {allowlist.map((u, i) => (
                <tr key={i}>
                  <td>{u.email}</td>
                  <td>
                    <span style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '4px', background: '#f1f5f9', fontWeight: 'bold' }}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td>{u.dept}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

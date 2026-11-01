'use client';

import { useEffect, useState } from 'react';

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [manualTitle, setManualTitle] = useState('');
  const [manualSeverity, setManualSeverity] = useState('critical');
  const [manualDesc, setManualDesc] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const fetchIncidents = () => {
    fetch('/api/incidents')
      .then((res) => res.json())
      .then((data) => setIncidents(data.incidents || []))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchIncidents();
    const interval = setInterval(fetchIncidents, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAcknowledge = async (id: string) => {
    await fetch(`/api/incidents/${id}/acknowledge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actor_id: 'technician-on-duty', notes: 'Acknowledged. On site with multimeter.' }),
    });
    fetchIncidents();
  };

  const handleResolve = async (id: string) => {
    await fetch(`/api/incidents/${id}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actor_id: 'technician-on-duty', notes: 'Short circuit repaired and circuit breaker reset.' }),
    });
    fetchIncidents();
  };

  const handleManualRaise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle || !manualDesc) return;

    setStatusMsg('Dispatching emergency incident and triggering power protection...');
    try {
      await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classroom_id: 'c1000000-0000-0000-0000-000000000204',
          incident_type: 'manual_hazard',
          severity: manualSeverity,
          title: manualTitle,
          description: manualDesc,
          trip_power_immediately: true,
        }),
      });

      setStatusMsg('Emergency incident raised! Circuit power severed and alerts sent to staff.');
      setManualTitle('');
      setManualDesc('');
      fetchIncidents();
    } catch (err: any) {
      setStatusMsg(`Error: ${err.message}`);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: '0 0 4px 0' }}>🚨 Emergency Help Desk &amp; Electrical Safety</h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
            Real-Time Hazard Feed &bull; Automated Breaker Trips &bull; Multi-Channel Staff Notifications
          </p>
        </div>
      </div>

      {statusMsg && (
        <div style={{ padding: '12px', background: '#fee2e2', color: '#991b1b', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', fontWeight: 'bold' }}>
          {statusMsg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Incidents Feed */}
        <div>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Active Incidents Feed</h3>
          {incidents.length === 0 ? (
            <div style={{ padding: '24px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#64748b' }}>
              No active emergency hazards detected. Campus electrical grid healthy.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {incidents.map((inc) => (
                <div
                  key={inc.id}
                  style={{
                    background: '#fff',
                    borderRadius: '8px',
                    border: `2px solid ${inc.severity === 'critical' ? '#ef4444' : '#f59e0b'}`,
                    padding: '16px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <span
                        style={{
                          background: inc.severity === 'critical' ? '#ef4444' : '#f59e0b',
                          color: '#fff',
                          fontSize: '11px',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          marginRight: '8px',
                        }}
                      >
                        {inc.severity}
                      </span>
                      <strong style={{ fontSize: '16px' }}>{inc.title}</strong>
                    </div>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                      Status: <strong style={{ textTransform: 'uppercase', color: inc.status === 'open' ? '#dc2626' : '#16a34a' }}>{inc.status}</strong>
                    </span>
                  </div>

                  <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#334155' }}>
                    {inc.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#64748b' }}>
                    <div>
                      Room: <strong>{inc.classroom_name}</strong> &bull; Power Cut:{' '}
                      <span style={{ color: inc.power_cut_applied ? '#dc2626' : '#64748b', fontWeight: 'bold' }}>
                        {inc.power_cut_applied ? '⚡ AUTOMATIC POWER CUT TRIPPED' : 'Normal'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {inc.status === 'open' && (
                        <button
                          onClick={() => handleAcknowledge(inc.id)}
                          style={{ padding: '6px 12px', background: '#e2e8f0', color: '#0f172a', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}
                        >
                          Acknowledge
                        </button>
                      )}
                      {inc.status !== 'resolved' && (
                        <button
                          onClick={() => handleResolve(inc.id)}
                          style={{ padding: '6px 12px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}
                        >
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Manual Emergency Trigger */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', height: 'fit-content' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#dc2626' }}>Staff Emergency Trigger</h3>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0' }}>
            Technicians or HODs can manually sever circuit power and sound multi-channel alarms if a smell of burning or spark is noticed.
          </p>

          <form onSubmit={handleManualRaise}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Hazard Title:</label>
              <input
                type="text"
                placeholder="e.g. Spark seen on back row outlet"
                value={manualTitle}
                onChange={(e) => setManualTitle(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Severity Level:</label>
              <select
                value={manualSeverity}
                onChange={(e) => setManualSeverity(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              >
                <option value="critical">Critical (Immediate Circuit Kill)</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Description:</label>
              <textarea
                placeholder="Describe observations..."
                rows={3}
                value={manualDesc}
                onChange={(e) => setManualDesc(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <button
              type="submit"
              style={{ width: '100%', padding: '10px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}
            >
              ⚡ Trip Power &amp; Sound Alarm
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

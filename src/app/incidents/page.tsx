'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, ShieldAlert, Zap, Clock, ShieldCheck } from 'lucide-react';
import { CAMPUS_CONFIG } from '@/lib/config/campus';

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

    setStatusMsg('Dispatching emergency incident and tripping circuit power protection...');
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

      setStatusMsg('Emergency incident raised! Circuit power severed and multi-channel staff notifications dispatched.');
      setManualTitle('');
      setManualDesc('');
      fetchIncidents();
    } catch (err: any) {
      setStatusMsg(`Error: ${err.message}`);
    }
  };

  return (
    <div style={{ margin: '40px 0', position: 'relative', zIndex: 1 }}>
      <div style={{ marginBottom: '32px' }}>
        <div className="eyebrow-badge" style={{ marginBottom: '10px' }}>
          <span>ELECTRICAL SAFETY &bull; DISPATCH</span>
        </div>
        <h1 style={{ margin: '0 0 6px 0', fontSize: '32px', fontWeight: 200, letterSpacing: '-0.025em', color: '#fff' }}>
          Emergency Help Desk &amp; Breaker Protection
        </h1>
        <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.45)', fontSize: '14px', fontWeight: 300 }}>
          Real-time short-circuit, overcurrent detection, automated breaker power cuts, and technician dispatch.
        </p>
      </div>

      {statusMsg && (
        <div
          style={{
            padding: '14px 18px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#fca5a5',
            borderRadius: '10px',
            marginBottom: '24px',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          {statusMsg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
        {/* Incidents Feed */}
        <div>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 400, color: '#fff' }}>
            Live Emergency Incident Stream
          </h2>

          {incidents.length === 0 ? (
            <div className="strata-card-wrapper">
              <div className="strata-card-aura" />
              <div
                className="strata-card-inner"
                style={{
                  padding: '40px 20px',
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.5)',
                }}
              >
                <ShieldCheck size={36} color="#8b5cf6" style={{ margin: '0 auto 12px auto' }} />
                <div style={{ color: '#fff', fontWeight: 400 }}>No active emergency hazards detected.</div>
                <div style={{ fontSize: '12px', fontWeight: 300, color: 'rgba(255, 255, 255, 0.4)', marginTop: '4px' }}>
                  Campus electrical breakers operating within rated thermal margins.
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {incidents.map((inc) => (
                <div
                  key={inc.id}
                  style={{
                    background: '#080814',
                    borderRadius: '16px',
                    border: `1px solid ${inc.severity === 'critical' ? 'rgba(239, 68, 68, 0.6)' : 'rgba(245, 158, 11, 0.5)'}`,
                    padding: '22px',
                    boxShadow: inc.severity === 'critical' ? '0 0 24px rgba(239, 68, 68, 0.15)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', gap: '12px' }}>
                    <div>
                      <span
                        style={{
                          background: inc.severity === 'critical' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                          color: inc.severity === 'critical' ? '#fca5a5' : '#fcd34d',
                          border: `1px solid ${inc.severity === 'critical' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
                          fontSize: '10px',
                          fontFamily: 'var(--font-mono)',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontWeight: 500,
                          textTransform: 'uppercase',
                          marginRight: '8px',
                        }}
                      >
                        {inc.severity}
                      </span>
                      <strong style={{ fontSize: '15px', color: '#fff', fontWeight: 500 }}>{inc.title}</strong>
                    </div>

                    <span
                      style={{
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: inc.status === 'open' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        color: inc.status === 'open' ? '#fca5a5' : '#34d399',
                        fontWeight: 500,
                        textTransform: 'uppercase',
                      }}
                    >
                      {inc.status}
                    </span>
                  </div>

                  <p style={{ margin: '0 0 16px 0', fontSize: '13px', fontWeight: 300, lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.55)' }}>
                    {inc.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', flexWrap: 'wrap', gap: '10px', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                      Location: <strong style={{ color: '#fff', fontWeight: 500 }}>{inc.classroom_name}</strong> &bull; Circuit Power:{' '}
                      <span style={{ color: inc.power_cut_applied ? '#f87171' : '#34d399', fontWeight: 500 }}>
                        {inc.power_cut_applied ? '⚡ CUT / TRIPPED' : 'NORMAL'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      {inc.status === 'open' && (
                        <button
                          onClick={() => handleAcknowledge(inc.id)}
                          className="strata-btn-secondary"
                          style={{
                            padding: '6px 12px',
                            fontSize: '12px',
                            borderRadius: '6px',
                          }}
                        >
                          Acknowledge
                        </button>
                      )}
                      {inc.status !== 'resolved' && (
                        <button
                          onClick={() => handleResolve(inc.id)}
                          className="strata-btn-primary"
                          style={{
                            padding: '6px 14px',
                            fontSize: '12px',
                            borderRadius: '6px',
                          }}
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

        {/* Manual Trigger Form */}
        <div>
          <div className="strata-card-wrapper">
            <div className="strata-card-aura" />
            <div className="strata-card-inner" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#f87171' }}>
                <ShieldAlert size={18} />
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 400, color: '#fff' }}>Staff Emergency Tripper</h2>
              </div>
              <p style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(255, 255, 255, 0.45)', margin: '0 0 20px 0', lineHeight: 1.5 }}>
                Technicians or HODs can manually sever circuit power and dispatch emergency notifications in case of visible arcing or thermal burning.
              </p>

              <form onSubmit={handleManualRaise}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 400, color: 'rgba(255, 255, 255, 0.55)', marginBottom: '6px' }}>
                    Hazard Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Back-row conduit spark observed"
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                    required
                    className="strata-input"
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 400, color: 'rgba(255, 255, 255, 0.55)', marginBottom: '6px' }}>
                    Severity Classification
                  </label>
                  <select
                    value={manualSeverity}
                    onChange={(e) => setManualSeverity(e.target.value)}
                    className="strata-input"
                  >
                    <option value="critical">Critical (Immediate Breaker Power Cut)</option>
                    <option value="high">High Severity</option>
                    <option value="medium">Medium</option>
                  </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 400, color: 'rgba(255, 255, 255, 0.55)', marginBottom: '6px' }}>
                    Detailed Observations
                  </label>
                  <textarea
                    placeholder="Describe location, smell, or visual sparks..."
                    rows={3}
                    value={manualDesc}
                    onChange={(e) => setManualDesc(e.target.value)}
                    required
                    className="strata-input"
                    style={{ lineHeight: 1.5 }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '13px',
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 'var(--radius-pill)',
                    fontWeight: 500,
                    fontSize: '13px',
                    cursor: 'pointer',
                    boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  ⚡ Trip Power &amp; Sound Alarm
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sliders, Activity, Zap, Play, CheckCircle2, RefreshCw } from 'lucide-react';
import { useRole } from '@/lib/auth/role-context';

export default function AutomationPage() {
  const { session } = useRole();
  const [rule, setRule] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [ticking, setTicking] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const loadData = async () => {
    try {
      const [rulesRes, eventsRes] = await Promise.all([
        fetch('/api/automation/rules').then((r) => r.json()),
        fetch('/api/automation/events').then((r) => r.json()),
      ]);
      setRule(rulesRes.rule);
      setEvents(eventsRes.events || []);
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleTriggerTick = async () => {
    setTicking(true);
    setStatusMsg('Executing automation engine evaluation cycle across all campus zones...');
    try {
      const res = await fetch('/api/automation/tick', { method: 'POST' });
      const data = await res.json();
      setStatusMsg(`Automation cycle complete: ${data.classrooms_evaluated} classrooms evaluated.`);
      loadData();
    } catch (err: any) {
      setStatusMsg(`Error: ${err.message}`);
    } finally {
      setTicking(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px', position: 'relative', zIndex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="eyebrow-badge" style={{ marginBottom: '10px' }}>
            <span>AUTONOMOUS IOT ENGINE</span>
          </div>
          <h1 style={{ margin: '0 0 6px 0', fontSize: '32px', fontWeight: 200, letterSpacing: '-0.025em', color: '#fff' }}>
            Automation &amp; Smart Switches
          </h1>
          <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.45)', fontSize: '14px', fontWeight: 300 }}>
            Zero-latency daylight harvesting, bench-row dimming, and comfort cooling coordination
          </p>
        </div>

        <button
          onClick={handleTriggerTick}
          disabled={ticking}
          className="strata-btn-primary"
          style={{
            padding: '12px 22px',
            fontSize: '13px',
            fontWeight: 500,
            cursor: ticking ? 'not-allowed' : 'pointer',
            opacity: ticking ? 0.7 : 1,
          }}
        >
          <RefreshCw size={15} className={ticking ? 'spin' : ''} />
          <span>{ticking ? 'Evaluating Engine...' : 'Run Automation Tick'}</span>
        </button>
      </div>

      {statusMsg && (
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
          {statusMsg}
        </div>
      )}

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Active Rules Card */}
        <div className="strata-card-wrapper">
          <div className="strata-card-aura" />
          <div className="strata-card-inner" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 400, color: '#fff', margin: 0 }}>Active Automation Profile</h2>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', padding: '3px 9px', borderRadius: '4px', background: 'rgba(124, 58, 237, 0.14)', color: '#c4b5fd', border: '1px solid rgba(124, 58, 237, 0.3)', fontWeight: 500 }}>
                v{rule?.version || 1} ACTIVE
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontWeight: 300 }}>Target Study Illuminance:</span>
                <strong style={{ color: '#fff', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{rule?.target_lux || 400} Lux</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontWeight: 300 }}>Lux Hysteresis Anti-Flicker:</span>
                <strong style={{ color: '#fff', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>&plusmn;{rule?.lux_hysteresis || 30} Lux</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontWeight: 300 }}>Unoccupied Row Safety Dim:</span>
                <strong style={{ color: '#c4b5fd', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{rule?.empty_dim_percent || 10}% Standby</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontWeight: 300 }}>Fan Cooling Activation:</span>
                <strong style={{ color: '#fff', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>&gt;{rule?.temp_fan_threshold || 26.5} &deg;C</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontWeight: 300 }}>Empty Room Grace Period:</span>
                <strong style={{ color: '#fff', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{rule?.empty_grace_period_seconds || 300} seconds (5m)</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontWeight: 300 }}>Timetable Lookahead:</span>
                <strong style={{ color: '#fff', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{rule?.timetable_lookahead_seconds || 600} seconds (10m)</strong>
              </div>
            </div>

            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <Link
                href="/admin"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  color: '#c4b5fd',
                  textDecoration: 'none',
                  fontWeight: 400,
                }}
              >
                <span>Edit thresholds in Admin Settings &rarr;</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Explainable Decision Feed */}
        <div className="strata-card-wrapper">
          <div className="strata-card-aura" />
          <div className="strata-card-inner" style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 400, color: '#fff', margin: '0 0 18px 0' }}>
              Explainable Decision Feed
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {events.map((evt) => (
                <div
                  key={evt.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '12px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#c4b5fd', fontWeight: 500, fontFamily: 'var(--font-mono)' }}>
                      {evt.event_type}
                    </span>
                    <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>{evt.classroom_name}</span>
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.55, marginBottom: '8px', fontWeight: 300 }}>
                    {evt.explanation}
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.35)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                    Action: {JSON.stringify(evt.actions_taken)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

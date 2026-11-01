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
    <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="eyebrow-badge" style={{ marginBottom: '8px' }}>
            <span>AUTONOMOUS IOT ENGINE</span>
          </div>
          <h1 style={{ margin: '0 0 6px 0', fontSize: '32px', fontWeight: 800, color: '#fff' }}>
            Automation &amp; Smart Switches
          </h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>
            Zero-latency daylight harvesting, bench-row dimming, and comfort cooling coordination
          </p>
        </div>

        <button
          onClick={handleTriggerTick}
          disabled={ticking}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 22px',
            background: 'linear-gradient(135deg, #6d4fe0, #7c3aed)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-pill)',
            fontSize: '14px',
            fontWeight: 700,
            cursor: ticking ? 'not-allowed' : 'pointer',
            boxShadow: 'var(--glow-violet)',
          }}
        >
          <RefreshCw size={16} className={ticking ? 'spin' : ''} />
          <span>{ticking ? 'Evaluating Engine...' : 'Run Automation Tick'}</span>
        </button>
      </div>

      {statusMsg && (
        <div style={{ padding: '12px 16px', background: 'var(--bg-surface)', border: '1px solid var(--border-mint)', color: 'var(--accent-mint)', borderRadius: '8px', marginBottom: '24px', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
          {statusMsg}
        </div>
      )}

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Active Rules Card */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-card)', padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>Active Automation Profile</h2>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', padding: '3px 8px', borderRadius: '4px', background: 'var(--accent-mint-subtle)', color: 'var(--accent-mint)', border: '1px solid var(--border-mint)' }}>
              v{rule?.version || 1} ACTIVE
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Target Study Illuminance:</span>
              <strong style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>{rule?.target_lux || 400} Lux</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Lux Hysteresis Anti-Flicker:</span>
              <strong style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>&plusmn;{rule?.lux_hysteresis || 30} Lux</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Unoccupied Row Safety Dim:</span>
              <strong style={{ color: 'var(--accent-mint)', fontFamily: 'var(--font-mono)' }}>{rule?.empty_dim_percent || 10}% Standby</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Fan Cooling Activation:</span>
              <strong style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>&gt;{rule?.temp_fan_threshold || 26.5} &deg;C</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Empty Room Grace Period:</span>
              <strong style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>{rule?.empty_grace_period_seconds || 300} seconds (5m)</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Timetable Lookahead:</span>
              <strong style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>{rule?.timetable_lookahead_seconds || 600} seconds (10m)</strong>
            </div>
          </div>

          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
            <Link
              href="/admin"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                color: 'var(--accent-mint)',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              <span>Edit thresholds in Admin Settings &rarr;</span>
            </Link>
          </div>
        </div>

        {/* Explainable Decision Feed */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-card)', padding: '28px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: '0 0 16px 0' }}>
            Explainable Decision Feed
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {events.map((evt) => (
              <div
                key={evt.id}
                style={{
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  fontSize: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--accent-mint)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    {evt.event_type}
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>{evt.classroom_name}</span>
                </div>
                <div style={{ color: '#e2e8f0', lineHeight: 1.5, marginBottom: '6px' }}>
                  {evt.explanation}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                  Action: {JSON.stringify(evt.actions_taken)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

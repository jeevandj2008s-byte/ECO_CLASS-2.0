'use client';

import React, { useEffect, useState } from 'react';
import { useRole } from '@/lib/auth/role-context';
import { Terminal, X, Zap, Sun, Users, AlertTriangle } from 'lucide-react';

export function SimDebugModal() {
  const { session } = useRole();
  const [isOpen, setIsOpen] = useState(false);
  const [statusText, setStatusText] = useState('');

  // Keyboard shortcut Ctrl+Shift+D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  const triggerScenario = async (code: string) => {
    setStatusText(`Injecting scenario '${code}'...`);
    try {
      await fetch('/api/simulator/inject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classroom_id: 'c1000000-0000-0000-0000-000000000204',
          scenario_code: code,
        }),
      });
      await fetch('/api/automation/tick', { method: 'POST' });
      setStatusText(`Scenario '${code}' executed successfully!`);
    } catch (err: any) {
      setStatusText(`Error: ${err.message}`);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '80px',
        right: '20px',
        width: '360px',
        background: '#080814',
        border: '1px solid rgba(124, 58, 237, 0.35)',
        borderRadius: '16px',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.85), 0 0 24px rgba(124, 58, 237, 0.25)',
        padding: '18px',
        zIndex: 100,
        color: '#fff',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 500 }}>
          <div className="strata-icon-tile" style={{ width: '28px', height: '28px' }}>
            <Terminal size={14} color="#a78bfa" />
          </div>
          <span>Sim Debug Console</span>
          <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.4)', fontFamily: 'var(--font-mono)' }}>Ctrl+Shift+D</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          style={{ background: 'transparent', border: 'none', color: 'rgba(255, 255, 255, 0.4)', cursor: 'pointer' }}
          aria-label="Close debug console"
        >
          <X size={16} />
        </button>
      </div>

      <div style={{ fontSize: '12px', fontWeight: 300, color: 'rgba(255, 255, 255, 0.5)', marginBottom: '14px' }}>
        Current Role: <strong style={{ color: '#fff', fontWeight: 500 }}>{session.role}</strong> &bull; Target: CR-204 (Turing Block)
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
        <button
          onClick={() => triggerScenario('lone_student_back')}
          style={{
            padding: '9px 10px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 400,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <Users size={12} color="#c4b5fd" />
          <span>1 Student (Back)</span>
        </button>

        <button
          onClick={() => triggerScenario('sunny_day_daylight_harvest')}
          style={{
            padding: '9px 10px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 400,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <Sun size={12} color="#facc15" />
          <span>Sunny Harvest</span>
        </button>

        <button
          onClick={() => triggerScenario('empty_room_idle')}
          style={{
            padding: '9px 10px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 400,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <Zap size={12} color="#94a3b8" />
          <span>Empty Shutdown</span>
        </button>

        <button
          onClick={() => triggerScenario('short_circuit')}
          style={{
            padding: '9px 10px',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.18), rgba(239, 68, 68, 0.08))',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '8px',
            color: '#fca5a5',
            fontSize: '11px',
            fontWeight: 400,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <AlertTriangle size={12} color="#ef4444" />
          <span>Short Circuit Trip</span>
        </button>
      </div>

      {statusText && (
        <div style={{ padding: '8px 10px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', fontSize: '11px', color: '#c4b5fd', fontFamily: 'var(--font-mono)' }}>
          {statusText}
        </div>
      )}
    </div>
  );
}

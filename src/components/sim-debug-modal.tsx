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
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-violet)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 20px 48px rgba(0, 0, 0, 0.75), 0 0 24px rgba(109, 79, 224, 0.3)',
        padding: '16px',
        zIndex: 100,
        color: '#fff',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700 }}>
          <Terminal size={16} color="var(--accent-mint)" />
          <span>Sim Debug Console</span>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Ctrl+Shift+D</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={16} />
        </button>
      </div>

      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
        Current Role: <strong>{session.role}</strong> &bull; Target: CR-204 (Turing Block)
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
        <button
          onClick={() => triggerScenario('lone_student_back')}
          style={{
            padding: '8px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '6px',
            color: '#fff',
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
          }}
        >
          <Users size={12} color="var(--accent-mint)" />
          1 Student (Back)
        </button>

        <button
          onClick={() => triggerScenario('sunny_day_daylight_harvest')}
          style={{
            padding: '8px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '6px',
            color: '#fff',
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
          }}
        >
          <Sun size={12} color="#facc15" />
          Sunny Harvest
        </button>

        <button
          onClick={() => triggerScenario('empty_room_idle')}
          style={{
            padding: '8px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '6px',
            color: '#fff',
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
          }}
        >
          <Zap size={12} color="#94a3b8" />
          Empty Shutdown
        </button>

        <button
          onClick={() => triggerScenario('short_circuit')}
          style={{
            padding: '8px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '6px',
            color: '#fca5a5',
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
          }}
        >
          <AlertTriangle size={12} color="#ef4444" />
          Short Circuit Trip
        </button>
      </div>

      {statusText && (
        <div style={{ padding: '6px 8px', background: 'var(--bg-surface)', borderRadius: '4px', fontSize: '11px', color: 'var(--accent-mint)', fontFamily: 'var(--font-mono)' }}>
          {statusText}
        </div>
      )}
    </div>
  );
}

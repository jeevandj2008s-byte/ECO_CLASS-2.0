'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, Activity, Zap, ChevronRight, X } from 'lucide-react';

const ROTATING_TIPS = [
  'Row 5 last-bench targeted lighting saved 48W in CR-204',
  'Daylight harvesting active: 40% artificial dimming across Block A',
  'Empty room grace period shut down 4 idle ceiling fans',
  'Subpanel live load optimal: 0 overcurrent alerts reported',
  'Solar generation meeting 32% of current Turing Block load',
];

export function LiveTicker() {
  const [tipIndex, setTipIndex] = useState(0);
  const [liveKW, setLiveKW] = useState(1.4);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const tipTimer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % ROTATING_TIPS.length);
    }, 6000);

    // Poll live simulator power
    const powerTimer = setInterval(async () => {
      try {
        const res = await fetch('/api/classrooms/c1000000-0000-0000-0000-000000000204');
        if (res.ok) {
          const data = await res.json();
          if (data.power_meter && data.power_meter.watts) {
            setLiveKW(Number((data.power_meter.watts / 1000).toFixed(2)));
          }
        }
      } catch {
        // use fallback
      }
    }, 4000);

    return () => {
      clearInterval(tipTimer);
      clearInterval(powerTimer);
    };
  }, []);

  if (isDismissed) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 40,
        maxWidth: '92vw',
        width: 'max-content',
        background: 'rgba(17, 17, 24, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-pill)',
        padding: '6px 14px 6px 10px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 12px 32px rgba(0,0,0,0.6), 0 0 20px rgba(109, 79, 224, 0.2)',
      }}
      className="live-ticker-container"
    >
      {/* Pill Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 8px',
          background: 'rgba(126, 232, 214, 0.15)',
          border: '1px solid var(--border-mint)',
          borderRadius: 'var(--radius-pill)',
          color: 'var(--accent-mint)',
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          whiteSpace: 'nowrap',
        }}
      >
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'var(--status-emerald)',
            boxShadow: '0 0 6px #10b981',
          }}
        />
        ECO CAMPUS
      </div>

      {/* Live kW */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '12px',
          fontFamily: 'var(--font-mono)',
          fontWeight: 600,
          color: '#fff',
          whiteSpace: 'nowrap',
        }}
      >
        <Zap size={14} color="#facc15" />
        <span>{liveKW} kW</span>
      </div>

      <span style={{ color: 'var(--border-medium)' }} className="hide-on-mobile">|</span>

      {/* Rotating Tip */}
      <div
        style={{
          fontSize: '12px',
          color: 'var(--text-secondary)',
          maxWidth: '380px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
        className="hide-on-mobile"
      >
        {ROTATING_TIPS[tipIndex]}
      </div>

      <span style={{ color: 'var(--border-medium)' }}>|</span>

      {/* AI Sparkle Button */}
      <Link
        href="/assistant"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          background: 'linear-gradient(135deg, #6d4fe0, #8b5cf6)',
          borderRadius: 'var(--radius-pill)',
          color: '#fff',
          fontSize: '11px',
          fontWeight: 700,
          textDecoration: 'none',
          boxShadow: '0 0 14px rgba(109, 79, 224, 0.4)',
          whiteSpace: 'nowrap',
        }}
      >
        <Sparkles size={12} color="#fff" />
        Ask Eco AI
      </Link>

      {/* Dismiss */}
      <button
        onClick={() => setIsDismissed(true)}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: '2px',
          display: 'flex',
          alignItems: 'center',
        }}
        title="Dismiss Ticker"
        aria-label="Dismiss Ticker"
      >
        <X size={14} />
      </button>

      <style jsx>{`
        @media (max-width: 640px) {
          .hide-on-mobile {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

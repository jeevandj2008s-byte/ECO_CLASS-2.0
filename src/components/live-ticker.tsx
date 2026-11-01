'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, Zap, X } from 'lucide-react';

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
        background: 'rgba(8, 8, 20, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(124, 58, 237, 0.25)',
        borderRadius: 'var(--radius-pill)',
        padding: '6px 14px 6px 10px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.7), 0 0 20px rgba(124, 58, 237, 0.15)',
      }}
      className="live-ticker-container"
    >
      {/* Pill Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          background: 'rgba(124, 58, 237, 0.15)',
          border: '1px solid rgba(124, 58, 237, 0.35)',
          borderRadius: 'var(--radius-pill)',
          color: '#c4b5fd',
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          fontWeight: 600,
          whiteSpace: 'nowrap',
        }}
      >
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#8b5cf6',
            boxShadow: '0 0 6px #8b5cf6',
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
          fontWeight: 400,
          color: '#fff',
          whiteSpace: 'nowrap',
        }}
      >
        <Zap size={13} color="#ddd6fe" />
        <span>{liveKW} kW</span>
      </div>

      <span style={{ color: 'rgba(255, 255, 255, 0.15)' }} className="hide-on-mobile">|</span>

      {/* Rotating Tip */}
      <div
        style={{
          fontSize: '12px',
          fontWeight: 300,
          color: 'rgba(255, 255, 255, 0.5)',
          maxWidth: '380px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
        className="hide-on-mobile"
      >
        {ROTATING_TIPS[tipIndex]}
      </div>

      <span style={{ color: 'rgba(255, 255, 255, 0.15)' }}>|</span>

      {/* AI Sparkle Button */}
      <Link
        href="/assistant"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
          borderRadius: 'var(--radius-pill)',
          color: '#fff',
          fontSize: '11px',
          fontWeight: 500,
          textDecoration: 'none',
          boxShadow: '0 0 14px rgba(124, 58, 237, 0.35)',
          whiteSpace: 'nowrap',
        }}
      >
        <Sparkles size={12} color="#fff" />
        <span>Ask Eco AI</span>
      </Link>

      {/* Dismiss */}
      <button
        onClick={() => setIsDismissed(true)}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'rgba(255, 255, 255, 0.35)',
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

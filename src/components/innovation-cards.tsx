'use client';

import React from 'react';
import Link from 'next/link';
import { Map, Cpu, Sparkles, ArrowRight } from 'lucide-react';

export function InnovationCards() {
  const innovations = [
    {
      title: 'Full-Scale Campus Map',
      description:
        'Models the main block, administration block, engineering blocks, sports court, hostel, and charging hub with live telemetry overlays.',
      linkText: 'Launch Campus Map',
      href: '/campus-map',
      icon: Map,
    },
    {
      title: 'Smart Automation Engine',
      description:
        'Compares real versus ideal consumption to isolate energy waste: empty-room fans and lights, idle equipment, and sunlight-ignoring lighting.',
      linkText: 'Open Control Center',
      href: '/dashboard',
      icon: Cpu,
    },
    {
      title: 'Eco AI Energy Coach',
      description:
        'AI advisor with offline fallback that gives ranked, quantified advice in Indian Rupees (₹) and kg CO₂ for admins, HODs, workers and students.',
      linkText: 'Chat with Eco AI',
      href: '/assistant',
      icon: Sparkles,
    },
  ];

  return (
    <section style={{ margin: '80px 0 60px 0' }}>
      {/* Centered Eyebrow, Heading & Subtext */}
      <div style={{ textAlign: 'center', marginBottom: '44px' }}>
        <div className="eyebrow-badge" style={{ marginBottom: '14px' }}>
          <span>CORE INNOVATIONS</span>
        </div>
        <h2
          style={{
            fontSize: 'clamp(28px, 4.5vw, 44px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            margin: '0 0 10px 0',
            color: '#ffffff',
          }}
        >
          Engineered for Campus Net-Zero Goals
        </h2>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '680px', marginInline: 'auto' }}>
          Fully simulated with progressive hardware support for physical smart meters, relays, and IP cameras.
        </p>
      </div>

      {/* 3 Equal Cards in a Row (Stack on Mobile) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
        }}
      >
        {innovations.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-card)',
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-card)',
                transition: 'transform 0.25s ease, border-color 0.25s ease',
              }}
              className="innovation-card"
            >
              <div>
                <div className="icon-tile-violet" style={{ marginBottom: '20px' }}>
                  <Icon size={22} />
                </div>

                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#ffffff',
                    margin: '0 0 12px 0',
                  }}
                >
                  {item.title}
                </h3>

                <p
                  style={{
                    fontSize: '13px',
                    lineHeight: 1.65,
                    color: 'var(--text-secondary)',
                    margin: '0 0 24px 0',
                  }}
                >
                  {item.description}
                </p>
              </div>

              <div>
                <Link
                  href={item.href}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--accent-mint)',
                    textDecoration: 'none',
                    transition: 'gap 0.2s ease',
                  }}
                >
                  <span>{item.linkText}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .innovation-card:hover {
          transform: translateY(-4px);
          border-color: var(--border-mint) !important;
        }
      `}</style>
    </section>
  );
}

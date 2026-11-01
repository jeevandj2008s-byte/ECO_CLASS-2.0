'use client';

import React from 'react';
import Link from 'next/link';
import { Layers, Compass, Sparkles, ArrowRight } from 'lucide-react';
import { CAMPUS_CONFIG } from '@/lib/config/campus';

export function InnovationCards() {
  const innovations = [
    {
      title: 'Full-Scale BIT Campus Map',
      description:
        'Models BIT Main Block, Administration Block, Engineering Block A, Engineering Block B, Sports Court, Hostel, and EV Charging Hub.',
      linkText: 'Launch Campus Map',
      href: '/campus-map',
      icon: Layers,
    },
    {
      title: 'Ghost Twin Technology',
      description:
        'Compares Real vs Ghost ideal consumption to isolate 8 deterministic energy ghosts: empty room ACs, continuous geysers, and idling projectors.',
      linkText: 'Open Control Center',
      href: '/dashboard',
      icon: Compass,
    },
    {
      title: 'Aura AI Energy Coach',
      description:
        'Google Gemini-backed advisor with offline fallback generating ranked quantified advice in Indian Rupees (₹) and kg CO₂ across CFO, Eco, and Student personas.',
      linkText: 'Chat with Aura AI',
      href: '/assistant',
      icon: Sparkles,
    },
  ];

  return (
    <section style={{ margin: '80px 0 60px 0', position: 'relative', zIndex: 1 }}>
      {/* Centered Eyebrow, Heading & Subtext matching Screenshot 1 */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '14px' }}>
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#38bdf8',
              boxShadow: '0 0 10px #38bdf8',
              display: 'inline-block',
            }}
          />
        </div>

        <div
          style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#7ee8d6',
            marginBottom: '12px',
          }}
        >
          CORE INNOVATIONS
        </div>

        <h2
          style={{
            fontSize: 'clamp(30px, 4.6vw, 48px)',
            fontWeight: 300,
            letterSpacing: '-0.035em',
            margin: '0 0 14px 0',
            color: '#ffffff',
          }}
        >
          Engineered for Campus Net-Zero Goals
        </h2>
        <p
          style={{
            margin: '0 auto',
            color: 'rgba(255, 255, 255, 0.48)',
            fontSize: '15px',
            fontWeight: 300,
            maxWidth: '680px',
            lineHeight: 1.6,
          }}
        >
          Fully simulated with progressive hardware support for physical smart meters, relays, and IP cameras.
        </p>
      </div>

      {/* 3 Equal Cards in a Row (Stack on Mobile) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '54px',
        }}
      >
        {innovations.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="strata-card-wrapper" style={{ minHeight: '320px' }}>
              <div className="strata-card-aura" />
              <div
                className="strata-card-inner"
                style={{
                  padding: '36px 30px',
                  justifyContent: 'space-between',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div>
                  <div className="strata-icon-tile" style={{ marginBottom: '24px' }}>
                    <Icon size={20} color="rgba(255, 255, 255, 0.9)" />
                  </div>

                  <h3
                    style={{
                      fontSize: '20px',
                      fontWeight: 500,
                      letterSpacing: '-0.015em',
                      color: '#ffffff',
                      margin: '0 0 14px 0',
                    }}
                  >
                    {item.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '13.5px',
                      fontWeight: 300,
                      lineHeight: 1.65,
                      color: 'rgba(255, 255, 255, 0.48)',
                      margin: 0,
                    }}
                  >
                    {item.description}
                  </p>
                </div>

                <div style={{ paddingTop: '24px' }}>
                  <Link
                    href={item.href}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#7ee8d6',
                      textDecoration: 'none',
                      transition: 'gap 0.2s ease, opacity 0.2s ease',
                    }}
                  >
                    <span>{item.linkText}</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Subfooter Quote matching Screenshot 1 */}
      <div
        style={{
          textAlign: 'center',
          fontSize: '12px',
          fontWeight: 300,
          color: 'rgba(255, 255, 255, 0.4)',
          letterSpacing: '0.02em',
        }}
      >
        Built with ❤️ by{' '}
        <strong style={{ color: '#ffffff', fontWeight: 500 }}>
          {CAMPUS_CONFIG.teamName}, {CAMPUS_CONFIG.collegeShortName}
        </strong>{' '}
        &bull; [{CAMPUS_CONFIG.address}]
      </div>
    </section>
  );
}

export default InnovationCards;

'use client';

import React from 'react';
import Link from 'next/link';
import { Layers, MapPin, Shield, HeartHandshake, ExternalLink } from 'lucide-react';
import { CAMPUS_CONFIG } from '@/lib/config/campus';

export function SiteFooter() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(11, 11, 16, 0.95)',
        marginTop: '80px',
        padding: '60px 20px 40px 20px',
        color: 'var(--text-secondary)',
      }}
    >
      <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
        {/* Four Column Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '40px',
            marginBottom: '48px',
          }}
        >
          {/* Column 1: Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #6d4fe0, #7ee8d6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Layers size={18} color="#0b0b10" strokeWidth={2.5} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '18px', color: '#fff', letterSpacing: '-0.02em' }}>
                Eco Class
              </span>
            </div>

            <p style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)', margin: '0 0 16px 0' }}>
              AI-driven smart campus platform for real-time energy monitoring, computer-vision occupancy,
              automatic lighting and fan control, and transparent carbon accounting.
            </p>

            <div
              style={{
                display: 'inline-block',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-medium)',
                background: 'var(--bg-surface)',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--accent-mint)',
              }}
            >
              Developed by {CAMPUS_CONFIG.teamName}, {CAMPUS_CONFIG.collegeShortName}
            </div>
          </div>

          {/* Column 2: Institution & Campus */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: '#fff', fontWeight: 700, fontSize: '14px' }}>
              <MapPin size={16} color="var(--accent-mint)" />
              Institution &amp; Campus
            </div>

            <div style={{ fontSize: '13px', lineHeight: '1.6', color: '#f8fafc', fontWeight: 600, marginBottom: '6px' }}>
              {CAMPUS_CONFIG.collegeName}
            </div>
            <p style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)', margin: '0 0 12px 0' }}>
              {CAMPUS_CONFIG.address} &bull; PIN: {CAMPUS_CONFIG.pinCode}
            </p>

            <div
              style={{
                borderLeft: '2px solid var(--accent-mint)',
                paddingLeft: '10px',
                fontSize: '12px',
                fontStyle: 'italic',
                color: 'var(--accent-mint)',
                lineHeight: '1.5',
              }}
            >
              &ldquo;{CAMPUS_CONFIG.quote}&rdquo;
            </div>
          </div>

          {/* Column 3: Quick Modules */}
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '14px', marginBottom: '14px' }}>
              Quick Modules
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px 16px',
                fontSize: '13px',
              }}
            >
              <Link href="/campus-map" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                Campus Map
              </Link>
              <Link href="/classroom-3d" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                3D Classroom
              </Link>
              <Link href="/vision-lab" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                Vision Lab
              </Link>
              <Link href="/automation" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                Automation
              </Link>
              <Link href="/dashboard" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                Energy Dashboard
              </Link>
              <Link href="/simulator" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                Simulator
              </Link>
              <Link href="/helpdesk" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                Help Desk
              </Link>
              <Link href="/assistant" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                AI Assistant
              </Link>
              <Link href="/how-to-use" style={{ color: 'var(--accent-mint)', textDecoration: 'none', fontWeight: 600 }}>
                How to Use →
              </Link>
            </div>
          </div>

          {/* Column 4: Assumptions & Standards */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: '#fff', fontWeight: 700, fontSize: '14px' }}>
              <Shield size={16} color="var(--accent-violet)" />
              Assumptions &amp; Standards
            </div>

            <p style={{ fontSize: '12px', lineHeight: '1.6', color: 'var(--text-secondary)', margin: '0 0 14px 0' }}>
              All currency in Indian Rupees ({CAMPUS_CONFIG.currencySymbol}) via {CAMPUS_CONFIG.locale}. Default India grid emission factor:{' '}
              <strong style={{ color: 'var(--accent-mint)' }}>{CAMPUS_CONFIG.gridEmissionFactorKgPerKWh} kg CO₂e/kWh</strong>.
              BESCOM HT tariff assumed at{' '}
              <strong style={{ color: '#fff' }}>₹{CAMPUS_CONFIG.tariffINRPerKWh.toFixed(2)}/kWh</strong> (editable in Settings).
            </p>

            <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              &copy; 2026 {CAMPUS_CONFIG.teamName}, {CAMPUS_CONFIG.collegeShortName}. Built for {CAMPUS_CONFIG.collegeShortName} and every sustainable campus that follows.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '20px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            fontSize: '12px',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            Eco Class &bull; Sustainable Class &bull; Active Campus Twin: <strong>{CAMPUS_CONFIG.campusCampusName}</strong>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Telemetry: 1883/TCP</span>
            <span>Edge AI: pgvector(512)</span>
            <span>Security: RLS Strict</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { Layers, MapPin, Shield } from 'lucide-react';
import { CAMPUS_CONFIG } from '@/lib/config/campus';

export function SiteFooter() {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        background: 'rgba(5, 5, 16, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        marginTop: '80px',
        padding: '64px 20px 40px 20px',
        color: 'rgba(255, 255, 255, 0.5)',
        position: 'relative',
        zIndex: 1,
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 16px rgba(124, 58, 237, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
              >
                <Layers size={18} color="#ffffff" strokeWidth={2.2} />
              </div>
              <span style={{ fontWeight: 600, fontSize: '17px', color: '#fff', letterSpacing: '-0.01em' }}>
                Eco Class
              </span>
            </div>

            <p style={{ fontSize: '13px', fontWeight: 300, lineHeight: 1.65, color: 'rgba(255, 255, 255, 0.45)', margin: '0 0 16px 0' }}>
              AI-driven smart campus platform for real-time energy monitoring, computer-vision occupancy,
              automatic lighting and fan control, and transparent carbon accounting.
            </p>

            <div
              style={{
                display: 'inline-block',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(255, 255, 255, 0.03)',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: '#c4b5fd',
              }}
            >
              Developed by {CAMPUS_CONFIG.teamName}, {CAMPUS_CONFIG.collegeShortName}
            </div>
          </div>

          {/* Column 2: Institution & Campus */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: '#fff', fontWeight: 500, fontSize: '14px' }}>
              <MapPin size={15} color="#8b5cf6" />
              Institution &amp; Campus
            </div>

            <div style={{ fontSize: '13px', lineHeight: 1.6, color: '#f8fafc', fontWeight: 500, marginBottom: '6px' }}>
              {CAMPUS_CONFIG.collegeName}
            </div>
            <p style={{ fontSize: '12px', fontWeight: 300, lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.45)', margin: '0 0 12px 0' }}>
              {CAMPUS_CONFIG.address} &bull; PIN: {CAMPUS_CONFIG.pinCode}
            </p>

            <div
              style={{
                borderLeft: '2px solid #8b5cf6',
                paddingLeft: '10px',
                fontSize: '12px',
                fontStyle: 'italic',
                color: '#c4b5fd',
                lineHeight: 1.5,
              }}
            >
              &ldquo;{CAMPUS_CONFIG.quote}&rdquo;
            </div>
          </div>

          {/* Column 3: Quick Modules */}
          <div>
            <div style={{ color: '#fff', fontWeight: 500, fontSize: '14px', marginBottom: '14px' }}>
              Quick Modules
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px 16px',
                fontSize: '13px',
                fontWeight: 300,
              }}
            >
              <Link href="/campus-map" style={{ color: 'rgba(255, 255, 255, 0.5)', textDecoration: 'none' }}>
                Campus Map
              </Link>
              <Link href="/classroom-3d" style={{ color: 'rgba(255, 255, 255, 0.5)', textDecoration: 'none' }}>
                3D Classroom
              </Link>
              <Link href="/vision-lab" style={{ color: 'rgba(255, 255, 255, 0.5)', textDecoration: 'none' }}>
                Vision Lab
              </Link>
              <Link href="/automation" style={{ color: 'rgba(255, 255, 255, 0.5)', textDecoration: 'none' }}>
                Automation
              </Link>
              <Link href="/dashboard" style={{ color: 'rgba(255, 255, 255, 0.5)', textDecoration: 'none' }}>
                Energy Dashboard
              </Link>
              <Link href="/simulator" style={{ color: 'rgba(255, 255, 255, 0.5)', textDecoration: 'none' }}>
                Simulator
              </Link>
              <Link href="/helpdesk" style={{ color: 'rgba(255, 255, 255, 0.5)', textDecoration: 'none' }}>
                Help Desk
              </Link>
              <Link href="/assistant" style={{ color: 'rgba(255, 255, 255, 0.5)', textDecoration: 'none' }}>
                AI Assistant
              </Link>
              <Link href="/how-to-use" style={{ color: '#c4b5fd', textDecoration: 'none', fontWeight: 400 }}>
                How to Use &rarr;
              </Link>
            </div>
          </div>

          {/* Column 4: Assumptions & Standards */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: '#fff', fontWeight: 500, fontSize: '14px' }}>
              <Shield size={15} color="#8b5cf6" />
              Assumptions &amp; Standards
            </div>

            <p style={{ fontSize: '12px', fontWeight: 300, lineHeight: 1.65, color: 'rgba(255, 255, 255, 0.45)', margin: '0 0 14px 0' }}>
              All currency in Indian Rupees ({CAMPUS_CONFIG.currencySymbol}) via {CAMPUS_CONFIG.locale}. Default India grid emission factor:{' '}
              <strong style={{ color: '#c4b5fd', fontWeight: 500 }}>{CAMPUS_CONFIG.gridEmissionFactorKgPerKWh} kg CO₂e/kWh</strong>.
              BESCOM HT tariff assumed at{' '}
              <strong style={{ color: '#fff', fontWeight: 500 }}>₹{CAMPUS_CONFIG.tariffINRPerKWh.toFixed(2)}/kWh</strong> (editable in Settings).
            </p>

            <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.35)', lineHeight: 1.5 }}>
              &copy; 2026 {CAMPUS_CONFIG.teamName}, {CAMPUS_CONFIG.collegeShortName}. Built for {CAMPUS_CONFIG.collegeShortName} and every sustainable campus that follows.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            paddingTop: '20px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            fontSize: '12px',
            fontWeight: 300,
            color: 'rgba(255, 255, 255, 0.35)',
          }}
        >
          <div>
            Eco Class &bull; Sustainable Class &bull; Active Campus Twin: <strong style={{ color: '#ffffff', fontWeight: 400 }}>{CAMPUS_CONFIG.campusCampusName}</strong>
          </div>
          <div style={{ display: 'flex', gap: '16px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
            <span>Telemetry: 1883/TCP</span>
            <span>Edge AI: pgvector(512)</span>
            <span>Security: RLS Strict</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

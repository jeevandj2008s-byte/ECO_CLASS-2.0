'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, MapPin, Shield } from 'lucide-react';
import { CAMPUS_CONFIG } from '@/lib/config/campus';

export function SiteFooter() {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(5, 5, 16, 0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        marginTop: '80px',
        padding: '64px 24px 60px 24px',
        color: 'rgba(255, 255, 255, 0.5)',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
        {/* Four Column Grid matching Screenshot 2 */}
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
                  width: '34px',
                  height: '34px',
                  borderRadius: '9px',
                  background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 16px rgba(124, 58, 237, 0.35)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
              >
                <Zap size={18} color="#ffffff" strokeWidth={2.4} />
              </div>
              <span style={{ fontWeight: 600, fontSize: '17px', color: '#fff', letterSpacing: '-0.01em' }}>
                AuraSync Energy Twin
              </span>
            </div>

            <p
              style={{
                fontSize: '13px',
                fontWeight: 300,
                lineHeight: 1.65,
                color: 'rgba(255, 255, 255, 0.45)',
                margin: '0 0 18px 0',
              }}
            >
              AI-driven Campus Digital Twin for real-time microgrid telemetry, computer vision
              occupancy optimization, and transparent carbon accounting.
            </p>

            <div
              style={{
                display: 'inline-block',
                padding: '7px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(255, 255, 255, 0.03)',
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.75)',
              }}
            >
              Developed by <strong style={{ color: '#fff', fontWeight: 500 }}>{CAMPUS_CONFIG.teamName}, {CAMPUS_CONFIG.collegeShortName}</strong>
            </div>
          </div>

          {/* Column 2: Institution & Campus */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '14px',
                color: '#7ee8d6',
                fontWeight: 600,
                fontSize: '11px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              <MapPin size={14} color="#7ee8d6" />
              INSTITUTION &amp; CAMPUS
            </div>

            <div style={{ fontSize: '14px', lineHeight: 1.6, color: '#f8fafc', fontWeight: 600, marginBottom: '6px' }}>
              {CAMPUS_CONFIG.collegeName}
            </div>
            <p style={{ fontSize: '12.5px', fontWeight: 300, lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.45)', margin: '0 0 14px 0' }}>
              {CAMPUS_CONFIG.address} &bull; PIN: {CAMPUS_CONFIG.pinCode}
            </p>

            <div
              style={{
                fontSize: '12.5px',
                fontStyle: 'italic',
                color: 'rgba(255, 255, 255, 0.65)',
                lineHeight: 1.5,
              }}
            >
              &ldquo;{CAMPUS_CONFIG.quote}&rdquo;
            </div>
          </div>

          {/* Column 3: Quick Modules */}
          <div>
            <div
              style={{
                color: '#7ee8d6',
                fontWeight: 600,
                fontSize: '11px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '14px',
              }}
            >
              QUICK MODULES
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                fontSize: '13px',
                fontWeight: 300,
              }}
            >
              <Link href="/campus-map" style={{ color: 'rgba(255, 255, 255, 0.6)', textDecoration: 'none' }}>
                BIT Campus Map
              </Link>
              <Link href="/vision-lab" style={{ color: 'rgba(255, 255, 255, 0.6)', textDecoration: 'none' }}>
                Computer Vision Lab
              </Link>
              <Link href="/automation" style={{ color: 'rgba(255, 255, 255, 0.6)', textDecoration: 'none' }}>
                Control &amp; Campus Master Switch
              </Link>
              <Link href="/dashboard" style={{ color: 'rgba(255, 255, 255, 0.6)', textDecoration: 'none' }}>
                Carbon ESG &amp; Net-Zero Center
              </Link>
              <Link href="/helpdesk" style={{ color: 'rgba(255, 255, 255, 0.6)', textDecoration: 'none' }}>
                Campus Helpdesk &amp; Worker App
              </Link>
            </div>
          </div>

          {/* Column 4: Assumptions & Standards */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '14px',
                color: '#7ee8d6',
                fontWeight: 600,
                fontSize: '11px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              <Shield size={14} color="#7ee8d6" />
              ASSUMPTIONS &amp; STANDARDS
            </div>

            <p style={{ fontSize: '12.5px', fontWeight: 300, lineHeight: 1.65, color: 'rgba(255, 255, 255, 0.45)', margin: '0 0 16px 0' }}>
              All currency in Indian Rupees ({CAMPUS_CONFIG.currencySymbol}) via {CAMPUS_CONFIG.locale}. Default India grid emission factor:{' '}
              <strong style={{ color: '#ffffff', fontWeight: 400 }}>{CAMPUS_CONFIG.gridEmissionFactorKgPerKWh} kg CO₂e/kWh</strong>.
              BESCOM HT tariff assumed at{' '}
              <strong style={{ color: '#fff', fontWeight: 400 }}>₹{CAMPUS_CONFIG.tariffINRPerKWh.toFixed(2)}/kWh</strong> (editable in Settings).
            </p>

            <div style={{ fontSize: '11.5px', color: 'rgba(255, 255, 255, 0.4)', lineHeight: 1.5 }}>
              &copy; 2026 {CAMPUS_CONFIG.teamName}, {CAMPUS_CONFIG.collegeShortName}. Built for {CAMPUS_CONFIG.collegeShortName} and every sustainable campus that follows.
            </div>
          </div>
        </div>

        {/* Bottom Bar with Sim Debug pill button */}
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
          {/* Sim Debug button from Screenshot 2 */}
          <button
            onClick={() => {
              window.dispatchEvent(
                new KeyboardEvent('keydown', { key: 'D', shiftKey: true, ctrlKey: true })
              );
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
            }}
            title="Open Simulator Debug Modal (Ctrl+Shift+D)"
          >
            <span>Sim Debug</span>
            <kbd style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '1px 4px', borderRadius: '4px', fontSize: '9px' }}>
              Ctrl+Shift+D
            </kbd>
          </button>

          <div style={{ display: 'flex', gap: '16px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
            <span>Telemetry: 1883/TCP (HiveMQ)</span>
            <span>Edge AI: pgvector(512)</span>
            <span>Security: RLS Strict</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;

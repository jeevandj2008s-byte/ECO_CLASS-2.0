'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CAMPUS_CONFIG } from '@/lib/config/campus';
import { Map, ArrowRight, Zap, Users, AlertTriangle } from 'lucide-react';

export default function CampusMapPage() {
  const [campusData, setCampusData] = useState<any>(null);
  const [classrooms, setClassrooms] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/campus')
      .then((res) => res.json())
      .then((data) => setCampusData(data))
      .catch(() => {});

    fetch('/api/classrooms')
      .then((res) => res.json())
      .then((data) => setClassrooms(data.classrooms || []))
      .catch(() => {});
  }, []);

  return (
    <div style={{ margin: '40px 0', position: 'relative', zIndex: 1 }}>
      <div style={{ marginBottom: '32px' }}>
        <div className="eyebrow-badge" style={{ marginBottom: '10px' }}>
          <span>SPATIAL DIGITAL TWIN</span>
        </div>
        <h1 style={{ margin: '0 0 6px 0', fontSize: '32px', fontWeight: 200, letterSpacing: '-0.025em', color: '#fff' }}>
          Campus Energy &amp; Facility Map
        </h1>
        <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.45)', fontSize: '14px', fontWeight: 300 }}>
          Real-time topology of academic blocks, floor sub-panels, and active classroom twins at {CAMPUS_CONFIG.collegeShortName}.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Block A: Turing Academic Block */}
        <div className="strata-card-wrapper">
          <div className="strata-card-aura" />
          <div className="strata-card-inner" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 400, letterSpacing: '-0.01em', color: '#fff' }}>
                🏢 Turing Academic Block (BLOCK-A)
              </h2>
              <span
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontWeight: 600,
                }}
              >
                ● ONLINE &bull; 230V
              </span>
            </div>

            <p style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(255, 255, 255, 0.45)', margin: '0 0 20px 0', lineHeight: 1.5 }}>
              Floors: 4 &bull; Dept: Computer Science &amp; Engineering &bull; Feeder: Main Solar Grid Intertie
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {classrooms.map((cr) => (
                <div
                  key={cr.id}
                  style={{
                    padding: '16px',
                    background: cr.circuit_healthy ? 'rgba(255, 255, 255, 0.03)' : 'rgba(239, 68, 68, 0.12)',
                    border: `1px solid ${cr.circuit_healthy ? 'rgba(255, 255, 255, 0.08)' : 'rgba(239, 68, 68, 0.4)'}`,
                    borderRadius: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '15px', color: '#fff', marginBottom: '4px' }}>
                      {cr.name}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 300, color: 'rgba(255, 255, 255, 0.45)' }}>
                      Occupancy: <strong style={{ color: '#c4b5fd', fontWeight: 500 }}>{cr.current_occupancy}</strong>/{cr.capacity} &bull; Lux: {cr.lux} &bull; Temp: {cr.temperature_c}&deg;C
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div className="mono-telemetry" style={{ fontWeight: 400, fontSize: '16px', color: cr.circuit_healthy ? '#fff' : '#ef4444' }}>
                      {cr.live_power_watts} W
                    </div>
                    <Link
                      href={`/classroom/${cr.id}`}
                      style={{
                        fontSize: '12px',
                        color: '#c4b5fd',
                        textDecoration: 'none',
                        fontWeight: 400,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginTop: '4px',
                      }}
                    >
                      <span>3D Twin</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Block B: Tesla Technology Block */}
        <div className="strata-card-wrapper">
          <div className="strata-card-aura" />
          <div className="strata-card-inner" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 400, letterSpacing: '-0.01em', color: '#fff' }}>
                🏢 Tesla Technology Block (BLOCK-B)
              </h2>
              <span
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'rgba(255, 255, 255, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontWeight: 500,
                }}
              >
                STANDBY PROFILE
              </span>
            </div>

            <p style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(255, 255, 255, 0.45)', margin: '0 0 20px 0', lineHeight: 1.5 }}>
              Floors: 4 &bull; Dept: Electronics &amp; Communication &bull; Feeder: Campus Transformer Substation
            </p>

            <div
              style={{
                padding: '28px 20px',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '13px',
                fontWeight: 300,
                lineHeight: 1.6,
              }}
            >
              All 4 floor circuits operating in scheduled evening idle mode.
              <div style={{ marginTop: '8px', color: '#c4b5fd', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                Live Standby Load: 12 W
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

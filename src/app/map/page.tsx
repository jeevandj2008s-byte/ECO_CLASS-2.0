'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

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
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: '0 0 4px 0' }}>Campus Energy &amp; Facility Map</h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Real-time spatial monitoring of academic blocks and classrooms</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
        {/* Block A */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '2px solid #22c55e' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: 0 }}>🏢 Turing Academic Block (BLOCK-A)</h3>
            <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '12px', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
              ONLINE
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0' }}>
            Floors: 4 | Department: Computer Science &amp; Engineering | Main Solar Feeder
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {classrooms.map((cr) => (
              <div
                key={cr.id}
                style={{
                  padding: '12px',
                  background: cr.circuit_healthy ? '#f8fafc' : '#fee2e2',
                  border: `1px solid ${cr.circuit_healthy ? '#cbd5e1' : '#ef4444'}`,
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{cr.name}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    Occupancy: {cr.current_occupancy} / {cr.capacity} | Lux: {cr.lux} | Temp: {cr.temperature_c}°C
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#0f172a' }}>
                    {cr.live_power_watts} W
                  </div>
                  <Link
                    href={`/classroom/${cr.id}`}
                    style={{ fontSize: '12px', color: '#16a34a', textDecoration: 'none', fontWeight: 'bold' }}
                  >
                    Open 3D View →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Block B */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: 0 }}>🏢 Tesla Technology Block (BLOCK-B)</h3>
            <span style={{ background: '#f1f5f9', color: '#475569', fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}>
              STANDBY
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0' }}>
            Floors: 4 | Department: Electronics &amp; Communication | Grid Power
          </p>
          <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '6px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
            Classroom circuits idling in scheduled night profile. Total draw: 12W.
          </div>
        </div>
      </div>
    </div>
  );
}

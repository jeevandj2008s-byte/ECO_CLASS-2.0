'use client';

import { useEffect, useState, use } from 'react';

interface SeatItem {
  seat_id: string;
  seat_number: number;
  row_index: number;
  bench_index: number;
  seat_index_in_bench: number;
  position: { x: number; y: number; z: number };
  is_occupied: boolean;
  person?: { role: string; label: string } | null;
}

export default function Classroom3DPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const classroomId = resolvedParams.id;

  const [classroom, setClassroom] = useState<any>(null);
  const [layout, setLayout] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState<number>(5);
  const [studentCountInSelectedRow, setStudentCountInSelectedRow] = useState<number>(1);
  const [actionMessage, setActionMessage] = useState<string>('');

  const fetchClassroomData = () => {
    Promise.all([
      fetch(`/api/classrooms/${classroomId}`).then((res) => res.json()),
      fetch(`/api/classrooms/${classroomId}/layout`).then((res) => res.json()),
    ])
      .then(([crData, layoutData]) => {
        setClassroom(crData);
        setLayout(layoutData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching room data:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchClassroomData();
    const interval = setInterval(fetchClassroomData, 4000);
    return () => clearInterval(interval);
  }, [classroomId]);

  const handlePlaceStudent = async () => {
    setActionMessage('Updating digital twin occupancy...');
    try {
      const rowOccupancy: Record<string, number> = {
        '1': 0, '2': 0, '3': 0, '4': 0, '5': 0,
      };
      rowOccupancy[String(selectedRow)] = studentCountInSelectedRow;

      await fetch('/api/occupancy/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classroom_id: classroomId,
          total_students: studentCountInSelectedRow,
          total_teachers: 0,
          row_occupancy: rowOccupancy,
        }),
      });

      // Trigger automation tick immediately
      await fetch('/api/automation/tick', { method: 'POST' });

      setActionMessage(`Placed ${studentCountInSelectedRow} student(s) in Row ${selectedRow}. Automation tick executed!`);
      fetchClassroomData();
    } catch (err: any) {
      setActionMessage(`Error: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255, 255, 255, 0.4)', fontWeight: 300 }}>
        Loading 3D Digital Twin Layout...
      </div>
    );
  }

  return (
    <div style={{ margin: '40px 0', position: 'relative', zIndex: 1 }}>
      {/* Breaker Alert Banner */}
      {classroom?.is_breaker_tripped && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(185, 28, 28, 0.9))',
            color: '#fff',
            padding: '16px 20px',
            borderRadius: '12px',
            marginBottom: '24px',
            fontWeight: 500,
            fontSize: '14px',
            boxShadow: '0 0 24px rgba(239, 68, 68, 0.4)',
          }}
        >
          ⚠️ CRITICAL: Circuit Breaker Tripped! Power has been automatically severed to prevent fire hazard.
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="eyebrow-badge" style={{ marginBottom: '8px' }}>
            <span>INTERACTIVE SPATIAL TWIN</span>
          </div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: '30px', fontWeight: 200, letterSpacing: '-0.025em', color: '#fff' }}>
            {classroom?.name || 'Classroom CR-204'} - 3D Digital Twin
          </h1>
          <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.45)', fontSize: '14px', fontWeight: 300 }}>
            Live Spatial Occupancy &bull; Zone Lighting &bull; Power Flow Distribution
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '8px 14px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '13px',
              color: 'rgba(255, 255, 255, 0.7)',
            }}
          >
            Occupancy: <strong style={{ color: '#fff', fontWeight: 500 }}>{classroom?.occupancy?.total || 0}</strong> / 30
          </div>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '8px 14px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '13px',
              color: 'rgba(255, 255, 255, 0.7)',
            }}
          >
            Power Draw: <strong style={{ color: '#c4b5fd', fontWeight: 500 }} className="mono-telemetry">{classroom?.power_meter?.watts || 0} W</strong>
          </div>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '8px 14px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '13px',
              color: 'rgba(255, 255, 255, 0.7)',
            }}
          >
            Lux: <strong style={{ color: '#fff', fontWeight: 500 }} className="mono-telemetry">{classroom?.environment?.lux || 0}</strong>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* Left: 3D Classroom Spatial Grid */}
        <div className="strata-card-wrapper" style={{ gridColumn: 'span 2' }}>
          <div className="strata-card-aura" />
          <div className="strata-card-inner" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase' }}>
                3D SPATIAL DIGITAL TWIN (TOP-DOWN PERSPECTIVE)
              </span>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#8b5cf6', fontWeight: 500 }}>
                ● LIVE SENSORS SYNCED
              </span>
            </div>

            {/* Teacher Desk & Front Board */}
            <div
              style={{
                width: '70%',
                margin: '0 auto 28px auto',
                padding: '12px',
                background: 'rgba(124, 58, 237, 0.12)',
                borderRadius: '8px',
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '0.04em',
                color: '#c4b5fd',
                border: '1px solid rgba(124, 58, 237, 0.25)',
                borderBottom: '2px solid #8b5cf6',
              }}
            >
              TEACHER PODIUM &amp; SMART BOARD (FRONT OF CLASSROOM)
            </div>

            {/* 5 Bench Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[1, 2, 3, 4, 5].map((rowNum) => {
                const occupantsInThisRow = classroom?.occupancy?.rows?.[rowNum] || 0;
                const zoneDev = classroom?.devices?.find((d: any) => d.rowIndex === rowNum);
                const brightness = zoneDev ? zoneDev.brightnessPercent : 0;
                const isBright = brightness > 30;

                return (
                  <div
                    key={rowNum}
                    style={{
                      padding: '14px 18px',
                      borderRadius: '12px',
                      background: isBright ? 'rgba(124, 58, 237, 0.16)' : 'rgba(255, 255, 255, 0.02)',
                      border: `1px solid ${isBright ? 'rgba(139, 92, 246, 0.5)' : 'rgba(255, 255, 255, 0.06)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div style={{ width: '150px' }}>
                      <div style={{ fontWeight: 500, fontSize: '13px', color: isBright ? '#ddd6fe' : '#ffffff' }}>
                        Row {rowNum} {rowNum === 5 ? '(Last Bench)' : rowNum === 1 ? '(Front Row)' : ''}
                      </div>
                      <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.45)', marginTop: '2px' }}>
                        Zone Light: {brightness}% {isBright ? '⚡ Active' : '🌙 Safety Dim'}
                      </div>
                    </div>

                    {/* 6 Seats in this row (Left bench 3 seats, Right bench 3 seats) */}
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      {/* Left Bench */}
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {[1, 2, 3].map((s) => {
                          const occupied = occupantsInThisRow >= s;
                          return (
                            <div
                              key={`b1-s${s}`}
                              title={`Row ${rowNum} Bench 1 Seat ${s}: ${occupied ? 'Occupied' : 'Empty'}`}
                              style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '6px',
                                background: occupied ? 'linear-gradient(135deg, #7c3aed, #8b5cf6)' : 'rgba(255, 255, 255, 0.03)',
                                border: `1px solid ${occupied ? '#c4b5fd' : 'rgba(255, 255, 255, 0.08)'}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '11px',
                                color: occupied ? '#ffffff' : 'rgba(255, 255, 255, 0.35)',
                                boxShadow: occupied ? '0 0 10px rgba(124, 58, 237, 0.4)' : 'none',
                                transition: 'all 0.2s ease',
                              }}
                            >
                              {occupied ? '👤' : s}
                            </div>
                          );
                        })}
                      </div>

                      <div style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', color: 'rgba(255, 255, 255, 0.25)' }}>
                        AISLE
                      </div>

                      {/* Right Bench */}
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {[4, 5, 6].map((s) => {
                          const occupied = occupantsInThisRow >= s;
                          return (
                            <div
                              key={`b2-s${s}`}
                              title={`Row ${rowNum} Bench 2 Seat ${s}: ${occupied ? 'Occupied' : 'Empty'}`}
                              style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '6px',
                                background: occupied ? 'linear-gradient(135deg, #7c3aed, #8b5cf6)' : 'rgba(255, 255, 255, 0.03)',
                                border: `1px solid ${occupied ? '#c4b5fd' : 'rgba(255, 255, 255, 0.08)'}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '11px',
                                color: occupied ? '#ffffff' : 'rgba(255, 255, 255, 0.35)',
                                boxShadow: occupied ? '0 0 10px rgba(124, 58, 237, 0.4)' : 'none',
                                transition: 'all 0.2s ease',
                              }}
                            >
                              {occupied ? '👤' : s}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', width: '80px', fontSize: '12px' }}>
                      <strong className="mono-telemetry" style={{ fontWeight: 500, color: '#fff' }}>
                        {zoneDev ? zoneDev.liveWatts : 0} W
                      </strong>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '11px', color: 'rgba(255, 255, 255, 0.35)', letterSpacing: '0.04em' }}>
              CEILING SENSORS &bull; 2x SMART VENTILATION FANS &bull; OPTICAL CAMERA DEPTH MAPPING
            </div>
          </div>
        </div>

        {/* Right Sidebar: Testing & Power Flow Tree */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Interactive Seat Placement Tool */}
          <div className="strata-card-wrapper">
            <div className="strata-card-aura" />
            <div className="strata-card-inner" style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: 400, color: '#fff' }}>
                Interactive Digital Twin Testing
              </h3>
              <p style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(255, 255, 255, 0.45)', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                Place students into bench rows to test targeted zone lighting (e.g. 1 student in Row 5).
              </p>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 400, color: 'rgba(255, 255, 255, 0.55)', marginBottom: '6px' }}>
                  Target Row:
                </label>
                <select
                  value={selectedRow}
                  onChange={(e) => setSelectedRow(Number(e.target.value))}
                  className="strata-input"
                >
                  <option value={5}>Row 5 (Last Bench)</option>
                  <option value={4}>Row 4</option>
                  <option value={3}>Row 3 (Middle)</option>
                  <option value={2}>Row 2</option>
                  <option value={1}>Row 1 (Front)</option>
                </select>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 400, color: 'rgba(255, 255, 255, 0.55)', marginBottom: '6px' }}>
                  Students Count:
                </label>
                <input
                  type="number"
                  min={0}
                  max={6}
                  value={studentCountInSelectedRow}
                  onChange={(e) => setStudentCountInSelectedRow(Number(e.target.value))}
                  className="strata-input"
                />
              </div>

              <button
                onClick={handlePlaceStudent}
                className="strata-btn-primary"
                style={{ width: '100%', padding: '12px' }}
              >
                Update Occupancy &amp; Run Engine
              </button>

              {actionMessage && (
                <div
                  style={{
                    marginTop: '14px',
                    fontSize: '12px',
                    color: '#c4b5fd',
                    background: 'rgba(124, 58, 237, 0.12)',
                    border: '1px solid rgba(124, 58, 237, 0.25)',
                    padding: '10px',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {actionMessage}
                </div>
              )}
            </div>
          </div>

          {/* Power Flow Tree */}
          <div className="strata-card-wrapper">
            <div className="strata-card-aura" />
            <div className="strata-card-inner" style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 400, color: '#fff' }}>
                Power Flow (Watts)
              </h3>
              <div style={{ fontSize: '12px', lineHeight: '1.9', fontFamily: 'var(--font-mono)' }}>
                <div style={{ color: '#fff', fontWeight: 500 }}>Campus Grid: 230V Active</div>
                <div style={{ paddingLeft: '16px', color: 'rgba(255, 255, 255, 0.7)' }}>
                  ↳ Turing Block Subpanel: {classroom?.power_flow?.block?.totalWatts || 0} W
                </div>
                <div style={{ paddingLeft: '32px', color: '#c4b5fd' }}>
                  ↳ CR-204 Circuit: {classroom?.power_flow?.classroom?.totalWatts || 0} W
                </div>
                {classroom?.power_flow?.zones?.map((z: any) => (
                  <div
                    key={z.rowIndex}
                    style={{
                      paddingLeft: '48px',
                      color: z.brightnessPercent > 30 ? '#c4b5fd' : 'rgba(255, 255, 255, 0.35)',
                    }}
                  >
                    ↳ {z.name}: {z.liveWatts} W ({z.brightnessPercent}%)
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading 3D Digital Twin Layout...</div>;
  }

  return (
    <div>
      {/* Breaker Alert Banner */}
      {classroom?.is_breaker_tripped && (
        <div style={{ background: '#ef4444', color: '#fff', padding: '16px', borderRadius: '8px', marginBottom: '20px', fontWeight: 'bold' }}>
          ⚠️ CRITICAL: Circuit Breaker Tripped! Power has been automatically severed to prevent fire hazard.
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: '0 0 4px 0' }}>{classroom?.name || 'Classroom CR-204'} - 3D Digital Twin</h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
            Live Spatial Occupancy &bull; Zone Lighting &bull; Power Flow Distribution
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', fontSize: '13px' }}>
            Occupancy: <strong>{classroom?.occupancy?.total || 0}</strong> / 30
          </div>
          <div style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', fontSize: '13px' }}>
            Power Draw: <strong>{classroom?.power_meter?.watts || 0} W</strong>
          </div>
          <div style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', fontSize: '13px' }}>
            Lux: <strong>{classroom?.environment?.lux || 0}</strong>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Left: 3D Classroom Placeholder Viewport (Canvas / Spatial Grid) */}
        <div style={{ background: '#0f172a', color: '#fff', borderRadius: '8px', padding: '24px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>3D SPATIAL DIGITAL TWIN (TOP-DOWN PERSPECTIVE)</span>
            <span style={{ fontSize: '12px', color: '#22c55e' }}>● LIVE SENSORS SYNCED</span>
          </div>

          {/* Teacher Desk & Front Board */}
          <div style={{ width: '60%', margin: '0 auto 24px auto', padding: '10px', background: '#334155', borderRadius: '4px', textAlign: 'center', fontSize: '13px', borderBottom: '3px solid #22c55e' }}>
            TEACHER PODIUM &amp; SMART BOARD (FRONT OF CLASSROOM)
          </div>

          {/* 5 Bench Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[1, 2, 3, 4, 5].map((rowNum) => {
              const occupantsInThisRow = classroom?.occupancy?.rows?.[rowNum] || 0;
              const zoneDev = classroom?.devices?.find((d: any) => d.rowIndex === rowNum);
              const brightness = zoneDev ? zoneDev.brightnessPercent : 0;
              const isBright = brightness > 30;

              return (
                <div
                  key={rowNum}
                  style={{
                    padding: '12px',
                    borderRadius: '6px',
                    background: isBright ? 'rgba(250, 204, 21, 0.15)' : 'rgba(51, 65, 85, 0.4)',
                    border: `1px solid ${isBright ? '#facc15' : '#475569'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ width: '130px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '13px', color: isBright ? '#facc15' : '#e2e8f0' }}>
                      Row {rowNum} {rowNum === 5 ? '(Last Bench)' : rowNum === 1 ? '(Front Row)' : ''}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>
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
                              width: '28px',
                              height: '28px',
                              borderRadius: '4px',
                              background: occupied ? '#22c55e' : '#1e293b',
                              border: `1px solid ${occupied ? '#4ade80' : '#475569'}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '11px',
                              color: '#fff',
                            }}
                          >
                            {occupied ? '👤' : s}
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ fontSize: '10px', color: '#64748b' }}>AISLE</div>

                    {/* Right Bench */}
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {[4, 5, 6].map((s) => {
                        const occupied = occupantsInThisRow >= s;
                        return (
                          <div
                            key={`b2-s${s}`}
                            title={`Row ${rowNum} Bench 2 Seat ${s}: ${occupied ? 'Occupied' : 'Empty'}`}
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '4px',
                              background: occupied ? '#22c55e' : '#1e293b',
                              border: `1px solid ${occupied ? '#4ade80' : '#475569'}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '11px',
                              color: '#fff',
                            }}
                          >
                            {occupied ? '👤' : s}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', width: '80px', fontSize: '12px' }}>
                    <strong>{zoneDev ? zoneDev.liveWatts : 0} W</strong>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '11px', color: '#64748b' }}>
            CEILING SENSORS &bull; 2x SMART VENTILATION FANS &bull; OPTICAL CAMERA DEPTH MAPPING
          </div>
        </div>

        {/* Right: Controls & Power Flow Tree */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Interactive Seat Placement Tool */}
          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Interactive Digital Twin Testing</h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0' }}>
              Place students into bench rows to test targeted zone lighting (e.g. 1 student in Row 5).
            </p>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Target Row:</label>
              <select
                value={selectedRow}
                onChange={(e) => setSelectedRow(Number(e.target.value))}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              >
                <option value={5}>Row 5 (Last Bench)</option>
                <option value={4}>Row 4</option>
                <option value={3}>Row 3 (Middle)</option>
                <option value={2}>Row 2</option>
                <option value={1}>Row 1 (Front)</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Students Count:</label>
              <input
                type="number"
                min={0}
                max={6}
                value={studentCountInSelectedRow}
                onChange={(e) => setStudentCountInSelectedRow(Number(e.target.value))}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <button
              onClick={handlePlaceStudent}
              style={{ width: '100%', padding: '10px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}
            >
              Update Occupancy &amp; Run Engine
            </button>

            {actionMessage && (
              <div style={{ marginTop: '10px', fontSize: '12px', color: '#0f172a', background: '#f1f5f9', padding: '8px', borderRadius: '4px' }}>
                {actionMessage}
              </div>
            )}
          </div>

          {/* Power Flow Tree */}
          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Power Flow (Watts)</h3>
            <div style={{ fontSize: '13px', lineHeight: '1.8', fontFamily: 'monospace' }}>
              <div>Campus Grid: 230V Active</div>
              <div style={{ paddingLeft: '16px' }}>↳ Turing Block Subpanel: {classroom?.power_flow?.block?.totalWatts || 0} W</div>
              <div style={{ paddingLeft: '32px' }}>↳ CR-204 Circuit: {classroom?.power_flow?.classroom?.totalWatts || 0} W</div>
              {classroom?.power_flow?.zones?.map((z: any) => (
                <div key={z.rowIndex} style={{ paddingLeft: '48px', color: z.brightnessPercent > 30 ? '#16a34a' : '#64748b' }}>
                  ↳ {z.name}: {z.liveWatts} W ({z.brightnessPercent}%)
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

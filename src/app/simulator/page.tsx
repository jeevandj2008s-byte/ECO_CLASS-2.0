'use client';

import { useEffect, useState } from 'react';

export default function SimulatorPage() {
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [selectedScenario, setSelectedScenario] = useState('lone_student_back');
  const [lux, setLux] = useState(150);
  const [temp, setTemp] = useState(25.0);
  const [humidity, setHumidity] = useState(50);
  const [currentAmps, setCurrentAmps] = useState(1.5);
  const [msg, setMsg] = useState('');
  const [lastDecision, setLastDecision] = useState<any>(null);

  useEffect(() => {
    fetch('/api/simulator/scenarios')
      .then((res) => res.json())
      .then((data) => setScenarios(data.scenarios || []))
      .catch((err) => console.error(err));
  }, []);

  const handleApplyScenario = async () => {
    setMsg('Injecting preset scenario and executing automation engine...');
    try {
      const res = await fetch('/api/simulator/inject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classroom_id: 'c1000000-0000-0000-0000-000000000204',
          scenario_code: selectedScenario,
        }),
      });
      const data = await res.json();

      // Trigger tick
      const tickRes = await fetch('/api/automation/tick', { method: 'POST' });
      const tickData = await tickRes.json();
      setLastDecision(tickData.results?.[0]?.decision);

      setMsg(`Scenario '${selectedScenario}' applied! Automation engine evaluated.`);
    } catch (err: any) {
      setMsg(`Error: ${err.message}`);
    }
  };

  const handleManualInject = async () => {
    setMsg('Injecting custom environment values...');
    try {
      await fetch('/api/devices/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classroom_id: 'c1000000-0000-0000-0000-000000000204',
          lux,
          temperature_c: temp,
          humidity_percent: humidity,
          current_amps: currentAmps,
          voltage_volts: 230,
          power_watts: currentAmps * 230,
        }),
      });

      const tickRes = await fetch('/api/automation/tick', { method: 'POST' });
      const tickData = await tickRes.json();
      setLastDecision(tickData.results?.[0]?.decision);

      setMsg('Custom telemetry injected & engine ticked.');
    } catch (err: any) {
      setMsg(`Error: ${err.message}`);
    }
  };

  return (
    <div style={{ margin: '40px 0', position: 'relative', zIndex: 1 }}>
      <div style={{ marginBottom: '32px' }}>
        <div className="eyebrow-badge" style={{ marginBottom: '10px' }}>
          <span>HARDWARE-IN-THE-LOOP SIMULATOR</span>
        </div>
        <h1 style={{ margin: '0 0 6px 0', fontSize: '32px', fontWeight: 200, letterSpacing: '-0.025em', color: '#fff' }}>
          🧪 Smart Classroom Hardware Simulator
        </h1>
        <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.45)', fontSize: '14px', fontWeight: 300 }}>
          Emulates occupancy, ambient lux, temperature, ceiling fans, and power meter telemetry without physical hardware.
        </p>
      </div>

      {msg && (
        <div
          style={{
            padding: '12px 18px',
            background: 'rgba(124, 58, 237, 0.12)',
            border: '1px solid rgba(124, 58, 237, 0.3)',
            color: '#c4b5fd',
            borderRadius: '10px',
            marginBottom: '24px',
            fontSize: '13px',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {msg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* Preset Scenarios Card */}
        <div className="strata-card-wrapper">
          <div className="strata-card-aura" />
          <div className="strata-card-inner" style={{ padding: '28px' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: 400, color: '#fff' }}>
              1. Preset Table-Driven Scenarios
            </h3>
            <p style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(255, 255, 255, 0.45)', margin: '0 0 20px 0', lineHeight: 1.5 }}>
              Choose from the key automation benchmarks:
            </p>

            <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {scenarios.map((sc) => {
                const isSelected = selectedScenario === sc.code;
                return (
                  <label
                    key={sc.code}
                    style={{
                      display: 'block',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      background: isSelected ? 'rgba(124, 58, 237, 0.16)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${isSelected ? 'rgba(139, 92, 246, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.18s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="radio"
                        name="scenario"
                        value={sc.code}
                        checked={isSelected}
                        onChange={(e) => setSelectedScenario(e.target.value)}
                        style={{ accentColor: '#8b5cf6' }}
                      />
                      <strong style={{ fontSize: '13px', fontWeight: 500, color: isSelected ? '#ddd6fe' : '#ffffff' }}>
                        {sc.name}
                      </strong>
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 300, color: 'rgba(255, 255, 255, 0.45)', marginTop: '4px', paddingLeft: '24px', lineHeight: 1.5 }}>
                      {sc.description}
                    </div>
                  </label>
                );
              })}
            </div>

            <button
              onClick={handleApplyScenario}
              className="strata-btn-primary"
              style={{ width: '100%', padding: '13px' }}
            >
              Apply Scenario &amp; Run Engine
            </button>
          </div>
        </div>

        {/* Custom Telemetry Injection */}
        <div className="strata-card-wrapper">
          <div className="strata-card-aura" />
          <div className="strata-card-inner" style={{ padding: '28px' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: 400, color: '#fff' }}>
              2. Live Sensor Injection Sliders
            </h3>
            <p style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(255, 255, 255, 0.45)', margin: '0 0 20px 0', lineHeight: 1.5 }}>
              Adjust physical values to test daylight harvesting and thermal comfort scaling.
            </p>

            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 300 }}>Ambient Daylight (Lux):</span>
                <strong style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>{lux} Lux</strong>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                value={lux}
                onChange={(e) => setLux(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#8b5cf6' }}
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 300 }}>Room Temperature (°C):</span>
                <strong style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>{temp} °C</strong>
              </div>
              <input
                type="range"
                min="18"
                max="40"
                step="0.5"
                value={temp}
                onChange={(e) => setTemp(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#8b5cf6' }}
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 300 }}>Relative Humidity (%):</span>
                <strong style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>{humidity} %</strong>
              </div>
              <input
                type="range"
                min="20"
                max="95"
                value={humidity}
                onChange={(e) => setHumidity(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#8b5cf6' }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 300 }}>Circuit Current Draw (Amps):</span>
                <strong style={{ color: currentAmps > 25 ? '#fca5a5' : '#c4b5fd', fontFamily: 'var(--font-mono)' }}>
                  {currentAmps} A
                </strong>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="0.5"
                value={currentAmps}
                onChange={(e) => setCurrentAmps(Number(e.target.value))}
                style={{ width: '100%', accentColor: currentAmps > 25 ? '#ef4444' : '#8b5cf6' }}
              />
              <div style={{ fontSize: '11px', fontWeight: 300, color: 'rgba(255, 255, 255, 0.35)', marginTop: '4px' }}>
                &gt;25A triggers overcurrent; &gt;50A triggers immediate short-circuit trip
              </div>
            </div>

            <button
              onClick={handleManualInject}
              className="strata-btn-primary"
              style={{ width: '100%', padding: '13px' }}
            >
              Inject Telemetry &amp; Evaluate
            </button>
          </div>
        </div>
      </div>

      {/* Decisions Output */}
      {lastDecision && (
        <div className="strata-card-wrapper" style={{ marginTop: '28px' }}>
          <div className="strata-card-aura" />
          <div className="strata-card-inner" style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 400, color: '#fff' }}>
              Automation Engine Decisions Log
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {lastDecision.actions?.map((act: any) => (
                <div
                  key={act.deviceId}
                  style={{
                    padding: '10px 14px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    fontSize: '13px',
                    color: 'rgba(255, 255, 255, 0.85)',
                  }}
                >
                  <strong style={{ color: '#c4b5fd', fontFamily: 'var(--font-mono)' }}>{act.deviceType.toUpperCase()}:</strong>{' '}
                  {act.powerOn ? `ON (Brightness: ${act.brightnessPercent}%, Speed: ${act.fanSpeed})` : 'OFF'} &bull;{' '}
                  <span style={{ color: 'rgba(255, 255, 255, 0.45)' }}>{act.reason}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

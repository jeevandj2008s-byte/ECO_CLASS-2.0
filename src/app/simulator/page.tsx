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
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 4px 0' }}>🧪 Smart Classroom Hardware Simulator</h2>
        <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
          Emulates occupancy, ambient lux, temperature, ceiling fans, and power meter telemetry without physical hardware.
        </p>
      </div>

      {msg && (
        <div style={{ padding: '12px', background: '#ecfdf5', color: '#065f46', borderRadius: '6px', marginBottom: '20px', fontSize: '14px' }}>
          {msg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Preset Scenarios Card */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>1. Preset Table-Driven Scenarios</h3>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0' }}>
            Choose from the key automation benchmarks:
          </p>

          <div style={{ marginBottom: '16px' }}>
            {scenarios.map((sc) => (
              <label
                key={sc.code}
                style={{
                  display: 'block',
                  padding: '10px',
                  borderRadius: '6px',
                  background: selectedScenario === sc.code ? '#f0fdf4' : '#fff',
                  border: `1px solid ${selectedScenario === sc.code ? '#22c55e' : '#e2e8f0'}`,
                  marginBottom: '8px',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="scenario"
                  value={sc.code}
                  checked={selectedScenario === sc.code}
                  onChange={(e) => setSelectedScenario(e.target.value)}
                  style={{ marginRight: '8px' }}
                />
                <strong>{sc.name}</strong>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', paddingLeft: '22px' }}>
                  {sc.description}
                </div>
              </label>
            ))}
          </div>

          <button
            onClick={handleApplyScenario}
            style={{ width: '100%', padding: '12px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}
          >
            Apply Scenario &amp; Run Engine
          </button>
        </div>

        {/* Custom Telemetry Injection */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>2. Live Sensor Injection Sliders</h3>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0' }}>
            Adjust physical values to test daylight harvesting and thermal comfort scaling.
          </p>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
              <span>Ambient Daylight (Lux):</span>
              <strong>{lux} Lux</strong>
            </div>
            <input
              type="range"
              min="0"
              max="1000"
              value={lux}
              onChange={(e) => setLux(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
              <span>Room Temperature (°C):</span>
              <strong>{temp} °C</strong>
            </div>
            <input
              type="range"
              min="18"
              max="40"
              step="0.5"
              value={temp}
              onChange={(e) => setTemp(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
              <span>Relative Humidity (%):</span>
              <strong>{humidity} %</strong>
            </div>
            <input
              type="range"
              min="20"
              max="95"
              value={humidity}
              onChange={(e) => setHumidity(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
              <span>Circuit Current Draw (Amps):</span>
              <strong style={{ color: currentAmps > 25 ? '#dc2626' : '#0f172a' }}>{currentAmps} A</strong>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="0.5"
              value={currentAmps}
              onChange={(e) => setCurrentAmps(Number(e.target.value))}
              style={{ width: '100%' }}
            />
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
              &gt;25A triggers overcurrent; &gt;50A triggers immediate short-circuit trip
            </div>
          </div>

          <button
            onClick={handleManualInject}
            style={{ width: '100%', padding: '12px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}
          >
            Inject Telemetry &amp; Evaluate
          </button>
        </div>
      </div>

      {/* Decisions Output */}
      {lastDecision && (
        <div style={{ marginTop: '24px', background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Automation Engine Decisions Log</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {lastDecision.actions?.map((act: any) => (
              <div key={act.deviceId} style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '13px' }}>
                <strong>{act.deviceType.toUpperCase()}:</strong> {act.powerOn ? `ON (Brightness: ${act.brightnessPercent}%, Speed: ${act.fanSpeed})` : 'OFF'} &bull; <span style={{ color: '#64748b' }}>{act.reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

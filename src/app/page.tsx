import Link from 'next/link';

export default function LandingPage() {
  return (
    <div>
      <div style={{ textAlign: 'center', padding: '40px 20px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px', margin: '0 0 8px 0', color: '#0f172a' }}>Eco Class</h1>
        <h2 style={{ fontSize: '20px', color: '#16a34a', margin: '0 0 16px 0', fontWeight: '500' }}>Sustainable Class</h2>
        <p style={{ maxWidth: '650px', margin: '0 auto 24px auto', color: '#475569', lineHeight: '1.6' }}>
          Smart-classroom energy conservation and electrical safety platform for colleges.
          Automates lights per bench row using occupancy and daylight harvesting; scales fans based on comfort thresholds;
          detects short circuits and overcurrent anomalies with immediate power protection.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href="/login" style={{ background: '#16a34a', color: '#fff', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}>
            Sign In / Access Portal
          </Link>
          <Link href="/classroom/c1000000-0000-0000-0000-000000000204" style={{ background: '#0f172a', color: '#fff', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none' }}>
            Open 3D Classroom Twin
          </Link>
          <Link href="/simulator" style={{ background: '#3b82f6', color: '#fff', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none' }}>
            Run Device Simulator
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 8px 0' }}>💡 Zone-Based Precision Lighting</h3>
          <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.5' }}>
            Light is metered per bench row. One student on the last bench illuminates only Row 5; empty rows are dimmed to 10% safety standby.
          </p>
          <Link href="/classroom/c1000000-0000-0000-0000-000000000204" style={{ fontSize: '14px', color: '#16a34a', textDecoration: 'none', fontWeight: 'bold' }}>
            View Digital Twin →
          </Link>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 8px 0' }}>⚡ Emergency Help Desk</h3>
          <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.5' }}>
            Monitors power meter telemetry for short circuits and current surges. Automatically trips circuit power and dispatches SMS/Email/Push alerts to staff.
          </p>
          <Link href="/incidents" style={{ fontSize: '14px', color: '#dc2626', textDecoration: 'none', fontWeight: 'bold' }}>
            Open Incident Banner →
          </Link>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 8px 0' }}>🤖 AI Assistant (Claude Tool Calling)</h3>
          <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.5' }}>
            Ask natural language questions: &quot;Why is the front row dim?&quot;, &quot;What is happening in Block B?&quot;, with server-side tool calling and strict injection defense.
          </p>
          <Link href="/assistant" style={{ fontSize: '14px', color: '#0284c7', textDecoration: 'none', fontWeight: 'bold' }}>
            Launch Assistant Chat →
          </Link>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 8px 0' }}>📊 Energy Dashboard & Baselines</h3>
          <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.5' }}>
            Real-time calculation of kWh saved against baseline, cost savings, carbon footprint reduction (kg CO2e), and CSV report export.
          </p>
          <Link href="/energy" style={{ fontSize: '14px', color: '#16a34a', textDecoration: 'none', fontWeight: 'bold' }}>
            View Consumption Metrics →
          </Link>
        </div>
      </div>
    </div>
  );
}

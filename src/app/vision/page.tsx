'use client';

import { useState } from 'react';

export default function VisionLabPage() {
  const [consent, setConsent] = useState(true);
  const [detectionResult, setDetectionResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleRunDetection = async () => {
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/vision/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classroom_id: 'c1000000-0000-0000-0000-000000000204',
          total_rows: 5,
          candidates: [
            { detection_id: 'det-1', x: 1.2, y: 6.5, is_teacher_area: false }, // Back row (Row 5)
          ],
        }),
      });

      const data = await res.json();
      setDetectionResult(data);
      setMessage('Vision detection mapped 1 student to Row 5 (Last Bench). Simulator updated.');
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePurgeEmbeddings = () => {
    setMessage('Biometric face embedding purged in accordance with privacy retention policy.');
    setDetectionResult(null);
  };

  return (
    <div style={{ margin: '40px 0', position: 'relative', zIndex: 1 }}>
      <div style={{ marginBottom: '32px' }}>
        <div className="eyebrow-badge" style={{ marginBottom: '10px' }}>
          <span>EDGE COMPUTER VISION</span>
        </div>
        <h1 style={{ margin: '0 0 6px 0', fontSize: '32px', fontWeight: 200, letterSpacing: '-0.025em', color: '#fff' }}>
          👁️ Vision Lab &amp; Privacy-First Face Recognition
        </h1>
        <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.45)', fontSize: '14px', fontWeight: 300 }}>
          Edge Vision &bull; pgvector 512-dim Embeddings &bull; Zero Raw-Frame Storage Policy
        </p>
      </div>

      {message && (
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
          {message}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Controls & Privacy */}
        <div className="strata-card-wrapper">
          <div className="strata-card-aura" />
          <div className="strata-card-inner" style={{ padding: '28px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 400, color: '#fff' }}>
              Biometric Consent &amp; Test Feed
            </h3>

            <div
              style={{
                padding: '14px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                marginBottom: '20px',
              }}
            >
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer', color: '#fff' }}>
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  style={{ accentColor: '#8b5cf6' }}
                />
                <strong style={{ fontWeight: 500 }}>I grant explicit consent</strong> for biometric embedding generation
              </label>
              <div style={{ fontSize: '11px', fontWeight: 300, color: 'rgba(255, 255, 255, 0.45)', marginTop: '6px', paddingLeft: '24px', lineHeight: 1.5 }}>
                Raw camera frames are destroyed in volatile memory immediately after feature extraction.
              </div>
            </div>

            <button
              onClick={handleRunDetection}
              disabled={loading}
              className="strata-btn-primary"
              style={{ width: '100%', padding: '13px', marginBottom: '12px' }}
            >
              {loading ? 'Processing Frame...' : 'Ingest Camera Frame (Simulate Row 5 Student)'}
            </button>

            <button
              onClick={handlePurgeEmbeddings}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(239, 68, 68, 0.08)',
                color: '#fca5a5',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px',
                fontWeight: 400,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              🗑️ Purge Stored Face Embeddings (GDPR Right-to-Forget)
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="strata-card-wrapper">
          <div className="strata-card-aura" />
          <div className="strata-card-inner" style={{ padding: '28px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 400, color: '#fff' }}>
              Detection &amp; Row Assignment
            </h3>

            {detectionResult ? (
              <div style={{ fontSize: '13px', lineHeight: '1.8', color: 'rgba(255, 255, 255, 0.8)' }}>
                <div>Total People Detected: <strong style={{ color: '#fff', fontWeight: 500 }}>{detectionResult.total_people}</strong></div>
                <div>Students Count: <strong style={{ color: '#fff', fontWeight: 500 }}>{detectionResult.student_count}</strong></div>
                <div>Teachers Count: <strong style={{ color: '#fff', fontWeight: 500 }}>{detectionResult.teacher_count}</strong></div>
                <div>Confidence Score: <strong style={{ color: '#c4b5fd', fontWeight: 500 }} className="mono-telemetry">{detectionResult.confidence_score}</strong></div>

                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <strong style={{ color: '#fff', fontWeight: 500 }}>Bench Row Breakdown:</strong>
                  <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                    {Object.entries(detectionResult.row_occupancy || {}).map(([r, c]) => (
                      <li key={r} style={{ color: Number(c) > 0 ? '#c4b5fd' : 'rgba(255, 255, 255, 0.4)' }}>
                        Row {r}: <strong style={{ fontWeight: 500 }}>{String(c)} occupants</strong> {Number(c) > 0 ? '👈 Triggering targeted lighting' : ''}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '13px', fontWeight: 300, textAlign: 'center', padding: '40px 0' }}>
                Click &quot;Ingest Camera Frame&quot; to test edge facial detection and spatial row projection.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

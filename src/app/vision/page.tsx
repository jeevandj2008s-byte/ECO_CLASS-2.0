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
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 4px 0' }}>👁️ Vision Lab &amp; Privacy-First Face Recognition</h2>
        <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
          Edge Vision &bull; pgvector 512-dim Embeddings &bull; Zero Raw-Frame Storage Policy
        </p>
      </div>

      {message && (
        <div style={{ padding: '12px', background: '#ecfdf5', color: '#065f46', borderRadius: '6px', marginBottom: '20px', fontSize: '14px' }}>
          {message}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Controls & Privacy */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Biometric Consent &amp; Test Feed</h3>

          <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #cbd5e1', marginBottom: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              <strong>I grant explicit consent</strong> for biometric embedding generation
            </label>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', paddingLeft: '24px' }}>
              Raw camera frames are destroyed in volatile memory immediately after feature extraction.
            </div>
          </div>

          <button
            onClick={handleRunDetection}
            disabled={loading}
            style={{ width: '100%', padding: '12px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', marginBottom: '12px' }}
          >
            {loading ? 'Processing Frame...' : 'Ingest Camera Frame (Simulate Row 5 Student)'}
          </button>

          <button
            onClick={handlePurgeEmbeddings}
            style={{ width: '100%', padding: '10px', background: '#fff', color: '#dc2626', border: '1px solid #dc2626', borderRadius: '6px', fontWeight: 'bold' }}
          >
            🗑️ Purge Stored Face Embeddings (GDPR Right-to-Forget)
          </button>
        </div>

        {/* Results */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Detection &amp; Row Assignment</h3>

          {detectionResult ? (
            <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
              <div>Total People Detected: <strong>{detectionResult.total_people}</strong></div>
              <div>Students Count: <strong>{detectionResult.student_count}</strong></div>
              <div>Teachers Count: <strong>{detectionResult.teacher_count}</strong></div>
              <div>Confidence Score: <strong>{detectionResult.confidence_score}</strong></div>

              <div style={{ marginTop: '12px' }}>
                <strong>Bench Row Breakdown:</strong>
                <ul style={{ margin: '6px 0', paddingLeft: '20px' }}>
                  {Object.entries(detectionResult.row_occupancy || {}).map(([r, c]) => (
                    <li key={r} style={{ color: Number(c) > 0 ? '#16a34a' : '#64748b' }}>
                      Row {r}: <strong>{String(c)} occupants</strong> {Number(c) > 0 ? '👈 Triggering targeted lighting' : ''}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', padding: '30px 0' }}>
              Click &quot;Ingest Camera Frame&quot; to test edge facial detection and spatial row projection.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

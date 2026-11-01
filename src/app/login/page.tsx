'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleGoogleSignIn = () => {
    setMessage('Initiating Google OAuth redirect to Supabase Auth provider...');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
    window.location.href = `${supabaseUrl}/auth/v1/authorize?provider=google`;
  };

  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(`Signed in as ${email}. (Demo mock session active)`);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', background: '#fff', padding: '32px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
      <h2 style={{ marginTop: 0, color: '#0f172a' }}>Sign in to Eco Class</h2>
      <p style={{ color: '#64748b', fontSize: '14px' }}>
        Log in with your college Google Workspace account or administrator credentials.
      </p>

      {message && (
        <div style={{ padding: '12px', background: '#ecfdf5', color: '#065f46', borderRadius: '6px', marginBottom: '20px', fontSize: '14px' }}>
          {message}
        </div>
      )}

      {/* Google OAuth Button */}
      <button
        onClick={handleGoogleSignIn}
        style={{
          width: '100%',
          padding: '12px',
          background: '#fff',
          border: '1px solid #cbd5e1',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          fontSize: '15px',
          fontWeight: '500',
          color: '#1e293b',
          marginBottom: '24px',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
          <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
        </svg>
        Sign in with Gmail (Google Workspace)
      </button>

      <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '13px', margin: '16px 0' }}>
        ── OR EMAIL & PASSWORD ──
      </div>

      <form onSubmit={handleEmailSignIn}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="worker@ecoclass.campus.edu"
            required
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          />
        </div>
        <button
          type="submit"
          style={{ width: '100%', padding: '12px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}
        >
          Sign In
        </button>
      </form>

      {/* Exact Google OAuth Setup Guide */}
      <div style={{ marginTop: '36px', padding: '16px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '13px' }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#0f172a' }}>Google OAuth Configuration Steps:</h4>
        <ol style={{ paddingLeft: '18px', margin: 0, color: '#475569', lineHeight: '1.6' }}>
          <li>Go to <strong>Google Cloud Console</strong> &gt; <em>APIs &amp; Services</em> &gt; <em>Credentials</em>.</li>
          <li>Create an <strong>OAuth 2.0 Client ID</strong> (Web application).</li>
          <li>Add Authorized Redirect URI: <code>https://&lt;your-project-id&gt;.supabase.co/auth/v1/callback</code>.</li>
          <li>In <strong>Supabase Dashboard</strong> &gt; <em>Authentication</em> &gt; <em>Providers</em> &gt; <em>Google</em>, enable Google and paste your Client ID and Client Secret.</li>
          <li>New Gmail accounts automatically get role <code>user</code> (read-only) unless invited or added to the admin allowlist.</li>
        </ol>
      </div>
    </div>
  );
}

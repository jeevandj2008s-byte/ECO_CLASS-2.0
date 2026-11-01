'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CAMPUS_CONFIG } from '@/lib/config/campus';
import { useRole } from '@/lib/auth/role-context';

function LoginFormContent() {
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/';
  const { loginAs } = useRole();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleGoogleSignIn = () => {
    setMessage('Initiating Google OAuth redirect to Supabase Auth provider...');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
    window.location.href = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(
      window.location.origin + returnUrl
    )}`;
  };

  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    loginAs('worker', email, email.split('@')[0]);
    setMessage(`Signed in successfully as ${email}. Redirecting...`);
    setTimeout(() => {
      window.location.href = returnUrl;
    }, 600);
  };

  return (
    <div style={{ maxWidth: '580px', margin: '48px auto', padding: '0 20px' }}>
      <div
        style={{
          background: 'var(--bg-surface)',
          padding: '36px',
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--border-medium)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div className="eyebrow-badge" style={{ marginBottom: '10px' }}>
            <span>SECURE CAMPUS SSO</span>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 8px 0', color: '#fff' }}>
            Sign In to Eco Class
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0 }}>
            Unified authentication for students, technicians, HODs, and administrators of {CAMPUS_CONFIG.collegeShortName}.
          </p>
        </div>

        {message && (
          <div
            style={{
              padding: '12px 16px',
              background: 'var(--accent-mint-subtle)',
              border: '1px solid var(--border-mint)',
              color: 'var(--accent-mint)',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '13px',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {message}
          </div>
        )}

        {/* Google OAuth Button */}
        <button
          onClick={handleGoogleSignIn}
          style={{
            width: '100%',
            padding: '14px',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-pill)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            fontSize: '14px',
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: '24px',
            cursor: 'pointer',
            transition: 'border-color 0.2s ease, transform 0.15s ease',
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

        <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '11px', fontFamily: 'var(--font-mono)', margin: '16px 0' }}>
          ── OR EMAIL &amp; PASSWORD ──
        </div>

        <form onSubmit={handleEmailSignIn}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              College Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="faculty@bit-bangalore.edu.in"
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid var(--border-medium)',
                background: 'var(--bg-surface-elevated)',
                color: '#fff',
                fontSize: '13px',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid var(--border-medium)',
                background: 'var(--bg-surface-elevated)',
                color: '#fff',
                fontSize: '13px',
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, #6d4fe0, #7c3aed)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: 'var(--glow-violet)',
            }}
          >
            Sign In with Credentials
          </button>
        </form>

        <div
          style={{
            marginTop: '32px',
            padding: '16px',
            background: 'var(--bg-surface-elevated)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
          }}
        >
          <div style={{ fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
            Google Cloud Console OAuth Instructions:
          </div>
          1. Add <code>https://&lt;project&gt;.supabase.co/auth/v1/callback</code> to Authorized Redirect URIs.<br />
          2. Register Client ID &amp; Secret in Supabase Auth &gt; Providers &gt; Google.<br />
          3. Pre-approved staff emails in <code>email_allowlist</code> automatically receive elevated roles.
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '60px' }}>Loading authentication portal...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}

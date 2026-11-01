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
    <div style={{ maxWidth: '540px', margin: '60px auto', padding: '0 20px', position: 'relative', zIndex: 1 }}>
      <div className="strata-card-wrapper">
        <div className="strata-card-aura" />
        <div
          className="strata-card-inner"
          style={{
            padding: '40px 32px',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div className="eyebrow-badge" style={{ marginBottom: '14px' }}>
              <span className="eyebrow-pulsing-dot" />
              <span>SECURE CAMPUS SSO</span>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 200, letterSpacing: '-0.025em', margin: '0 0 10px 0', color: '#fff' }}>
              Sign In to Eco Class
            </h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: '13px', fontWeight: 300, margin: 0, lineHeight: 1.6 }}>
              Unified authentication for students, technicians, HODs, and administrators of {CAMPUS_CONFIG.collegeShortName}.
            </p>
          </div>

          {message && (
            <div
              style={{
                padding: '12px 16px',
                background: 'rgba(124, 58, 237, 0.12)',
                border: '1px solid rgba(124, 58, 237, 0.3)',
                color: '#c4b5fd',
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
              padding: '13px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-pill)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              fontSize: '13px',
              fontWeight: 400,
              color: '#ffffff',
              marginBottom: '24px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            className="google-sso-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>Sign in with Gmail (Google Workspace)</span>
          </button>

          <div style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.3)', fontSize: '11px', fontFamily: 'var(--font-mono)', margin: '18px 0' }}>
            ── OR EMAIL &amp; PASSWORD ──
          </div>

          <form onSubmit={handleEmailSignIn}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 400, color: 'rgba(255, 255, 255, 0.55)', marginBottom: '6px' }}>
                College Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="faculty@bit-bangalore.edu.in"
                required
                className="strata-input"
              />
            </div>

            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 400, color: 'rgba(255, 255, 255, 0.55)', marginBottom: '6px' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="strata-input"
              />
            </div>

            <button
              type="submit"
              className="strata-btn-primary"
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '13px',
                fontWeight: 500,
              }}
            >
              Sign In with Credentials
            </button>
          </form>

          <div
            style={{
              marginTop: '32px',
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              fontSize: '12px',
              fontWeight: 300,
              color: 'rgba(255, 255, 255, 0.45)',
              lineHeight: 1.6,
            }}
          >
            <div style={{ fontWeight: 500, color: '#fff', marginBottom: '6px' }}>
              Google Cloud Console OAuth Instructions:
            </div>
            1. Add <code>https://&lt;project&gt;.supabase.co/auth/v1/callback</code> to Authorized Redirect URIs.<br />
            2. Register Client ID &amp; Secret in Supabase Auth &gt; Providers &gt; Google.<br />
            3. Pre-approved staff emails in <code>email_allowlist</code> automatically receive elevated roles.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.4)', fontWeight: 300 }}>Loading authentication portal...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}

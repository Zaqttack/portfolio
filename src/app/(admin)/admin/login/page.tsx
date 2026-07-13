'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useSearchParams } from 'next/navigation';
import { Suspense, useRef, useState } from 'react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const authError = searchParams.get('error');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );

  const send = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setErr('');
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/admin/auth/callback`,
        shouldCreateUser: false,
      },
    });
    setLoading(false);
    if (error) {
      setErr(error.message);
    } else {
      setSent(true);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#0E0F12',
    border: '1px solid #2C3037',
    borderRadius: '9px',
    padding: '11px 13px',
    color: 'var(--text-1)',
    font: '500 14px var(--font-space), sans-serif',
    outline: 'none',
    transition: 'border-color .2s',
  };

  return (
    <div
      data-theme="dark"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'radial-gradient(1200px 600px at 50% -10%, #121317, #0B0C0E 60%)',
      }}
    >
      <div style={{ width: 'min(380px, 92vw)' }}>
        <div
          style={{
            font: '700 13px var(--font-mono), monospace',
            color: 'var(--text-1)',
            marginBottom: '6px',
          }}
        >
          zq<span style={{ color: 'var(--accent)' }}>.</span>admin
        </div>
        <div
          style={{
            font: '500 11px var(--font-mono), monospace',
            color: 'var(--text-4)',
            marginBottom: '26px',
          }}
        >
          restricted · {process.env.NEXT_PUBLIC_SITE_DOMAIN ?? 'yoursite.dev'}
        </div>

        <div
          style={{
            border: '1px solid var(--border-2)',
            borderRadius: '14px',
            background: 'var(--panel-1)',
            padding: '26px',
          }}
        >
          {sent ? (
            <div>
              <div
                style={{
                  font: '600 14px var(--font-space), sans-serif',
                  color: 'var(--text-1)',
                  marginBottom: '10px',
                }}
              >
                Check your email
              </div>
              <div
                style={{
                  font: '500 13px var(--font-space), sans-serif',
                  color: 'var(--text-3)',
                  lineHeight: 1.6,
                }}
              >
                Magic link sent to <span style={{ color: 'var(--text-1)' }}>{email}</span>. Click it
                to sign in.
              </div>
            </div>
          ) : (
            <>
              {authError && (
                <div
                  style={{
                    font: '500 11px var(--font-mono), monospace',
                    color: '#E5534B',
                    marginBottom: '16px',
                  }}
                >
                  {authError === 'auth_error' ? 'Auth failed — try again.' : authError}
                </div>
              )}
              <label
                style={{
                  display: 'block',
                  font: '500 10px var(--font-mono), monospace',
                  letterSpacing: '.1em',
                  color: 'var(--text-3)',
                  marginBottom: '9px',
                }}
              >
                EMAIL
              </label>
              <input
                ref={inputRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="you@example.com"
                autoComplete="email"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={(e) => (e.target.style.borderColor = '#2C3037')}
              />
              {err && (
                <div
                  style={{
                    font: '500 11px var(--font-mono), monospace',
                    color: '#E5534B',
                    marginTop: '9px',
                  }}
                >
                  {err}
                </div>
              )}
              <button
                onClick={send}
                disabled={loading}
                style={{
                  width: '100%',
                  marginTop: '16px',
                  background: loading ? '#3a2a1e' : 'var(--accent)',
                  color: 'var(--canvas)',
                  border: 'none',
                  borderRadius: '9px',
                  padding: '12px',
                  font: '600 13px var(--font-space), sans-serif',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'filter .2s',
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.filter = 'brightness(1.08)';
                }}
                onMouseLeave={(e) => (e.currentTarget.style.filter = 'none')}
              >
                {loading ? 'Sending…' : 'Send magic link →'}
              </button>
            </>
          )}
        </div>

        <div
          style={{
            font: '500 10px var(--font-mono), monospace',
            color: '#3A3E45',
            marginTop: '16px',
            textAlign: 'center',
          }}
        >
          no link from the site · bookmark this page
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

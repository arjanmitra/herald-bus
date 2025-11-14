'use client';

import { useEffect, useState } from 'react';
import PdfUpload from './PdfUpload';
import '../styles.css';

export default function AuthLanding() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const resp = await fetch('/api/auth/me');
        const json = await resp.json();
        if (json.authenticated) setAuthenticated(true);
      } catch (e) {
        // ignore
      }
    };
    check();
  }, []);

  const submit = async () => {
    setLoading(true);
    setMessage('');
    try {
      const url = mode === 'signin' ? '/api/auth/signin' : '/api/auth/signup';
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await resp.json();
      if (resp.ok) {
        setMessage(mode === 'signin' ? 'Signed in successfully' : 'Account created successfully');
        setMessageType('success');
        setTimeout(() => setAuthenticated(true), 1000);
      } else {
        setMessage(data.error || 'Failed');
        setMessageType('error');
      }
    } catch (e) {
      setMessage('Request failed');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  if (authenticated) return <PdfUpload />;

  return (
    <>
      <div className="auth-container">
        <header className="auth-header">
          <h1>Herald</h1>
        </header>

        <main className="auth-main">
          <div className="auth-card">
            <h2>{mode === 'signin' ? 'Sign In' : 'Create Account'}</h2>
            <p className="auth-subtitle">
              {mode === 'signin'
                ? 'Access your extraction history and manage documents'
                : 'Create an account to save and manage your extractions'}
            </p>

            {message && (
              <div className={`auth-message ${messageType}`}>
                {message}
              </div>
            )}

            <div className="auth-form-group">
              <label htmlFor="email" className="auth-label">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && submit()}
                placeholder="you@example.com"
                disabled={loading}
                className="auth-input"
              />
            </div>

            <div className="auth-form-group">
              <label htmlFor="password" className="auth-label">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && submit()}
                placeholder="••••••••"
                disabled={loading}
                className="auth-input"
              />
            </div>

            <div className="auth-mode-toggle">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setMessage('');
                }}
                disabled={loading}
                className={`auth-mode-btn ${mode === 'signin' ? 'active' : ''}`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setMessage('');
                }}
                disabled={loading}
                className={`auth-mode-btn ${mode === 'signup' ? 'active' : ''}`}
              >
                Create Account
              </button>
            </div>

            <button
              type="button"
              onClick={submit}
              disabled={loading || !email.trim() || !password.trim()}
              className="auth-submit-btn"
            >
              {loading ? (
                <span className="auth-spinner">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" opacity="0.25" />
                    <path d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" fill="currentColor" opacity="0.75" />
                  </svg>
                  Please wait…
                </span>
              ) : mode === 'signin' ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </button>

            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#999' }}>
              {mode === 'signin'
                ? "Don't have an account? Click the 'Create Account' tab above"
                : 'Already have an account? Click the \'Sign In\' tab above'}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}


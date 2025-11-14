'use client';

import { useEffect, useState } from 'react';
import PdfUpload from './PdfUpload';

const styles = `
  .auth-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    display: flex;
    flex-direction: column;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  }
  
  .auth-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px 30px;
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  }
  
  .auth-header h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
    letter-spacing: -0.5px;
  }
  
  .auth-main {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
  }
  
  .auth-card {
    background: white;
    border-radius: 12px;
    padding: 40px;
    max-width: 450px;
    width: 100%;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.15);
    border: 1px solid #e2e8f0;
  }
  
  .auth-card h2 {
    margin: 0 0 10px 0;
    font-size: 28px;
    font-weight: 700;
    color: #333;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .auth-subtitle {
    margin: 0 0 30px 0;
    font-size: 14px;
    color: #888;
    line-height: 1.5;
  }
  
  .auth-message {
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-size: 13px;
    font-weight: 500;
  }
  
  .auth-message.success {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }
  
  .auth-message.error {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }
  
  .auth-form-group {
    margin-bottom: 20px;
  }
  
  .auth-label {
    display: block;
    margin-bottom: 8px;
    font-size: 13px;
    font-weight: 600;
    color: #333;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .auth-input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    box-sizing: border-box;
    transition: all 0.3s ease;
    font-family: inherit;
    color: #333;
  }
  
  .auth-input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  .auth-input:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  .auth-mode-toggle {
    display: flex;
    gap: 8px;
    background: #f1f5f9;
    padding: 8px;
    border-radius: 8px;
    margin-bottom: 25px;
  }
  
  .auth-mode-btn {
    flex: 1;
    padding: 12px 16px;
    border: none;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: transparent;
    color: #888;
  }
  
  .auth-mode-btn.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);
  }
  
  .auth-mode-btn:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  .auth-submit-btn {
    width: 100%;
    padding: 14px 20px;
    border: none;
    border-radius: 8px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  }
  
  .auth-submit-btn:hover:not(:disabled) {
    box-shadow: 0 6px 25px rgba(102, 126, 234, 0.5);
    transform: translateY(-2px);
  }
  
  .auth-submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .auth-spinner {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  
  .auth-spinner svg {
    width: 16px;
    height: 16px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

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
      <style>{styles}</style>
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


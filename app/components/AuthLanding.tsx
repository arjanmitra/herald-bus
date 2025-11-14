'use client';

import { useState } from 'react';
import { useAuth } from './shared/AuthContext';
import Message from './shared/Message';
import '../styles.css';

export default function AuthLanding() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [loading, setLoading] = useState(false);
  const { signin, signup } = useAuth();

  const submit = async () => {
    setLoading(true);
    setMessage('');
    try {
      if (mode === 'signin') {
        await signin(email, password);
      } else {
        await signup(email, password);
      }
      setMessage(mode === 'signin' ? 'Signed in successfully' : 'Account created successfully');
      setMessageType('success');
    } catch (error: any) {
      setMessage(error.message || 'Failed');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-container">
        <main className="auth-main">
          <div className="auth-card">
            <h2>{mode === 'signin' ? 'Sign In' : 'Create Account'}</h2>
            <p className="auth-subtitle">
              {mode === 'signin'
                ? 'Access your extraction history and manage documents'
                : 'Create an account to save and manage your extractions'}
            </p>

            <Message 
              message={message}
              type={messageType}
              onClose={() => { setMessage(''); setMessageType(''); }}
            />

            <div className="auth-form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={loading}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
              />
            </div>

            <div className="auth-form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
              />
            </div>

            <button
              className="auth-button"
              onClick={submit}
              disabled={loading || !email.trim() || !password.trim()}
            >
              {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>

            <div className="auth-toggle">
              {mode === 'signin' ? (
                <>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="auth-link"
                    disabled={loading}
                  >
                    Create one
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="auth-link"
                    disabled={loading}
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
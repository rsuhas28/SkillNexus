import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [demoToken, setDemoToken] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.forgotPassword({ email: email.trim() });
      setSubmitted(true);
      if (res.demoResetToken) {
        setDemoToken(res.demoResetToken);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Unable to connect to SkillNexus. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 70px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '440px', width: '100%' }}>
        <div className="card" id="forgot-password-card" style={{ padding: '2.25rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#818cf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}>
              <KeyRound size={26} />
            </div>
            <h1 style={{ fontSize: '1.65rem', marginBottom: '0.4rem', color: '#fff' }}>
              Reset Password
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Enter your email address and we'll send you recovery instructions.
            </p>
          </div>

          {errorMessage && (
            <div className="alert-box alert-error">
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <div>{errorMessage}</div>
            </div>
          )}

          {submitted ? (
            <div>
              <div className="alert-box alert-info" id="forgot-safe-response" style={{ textAlign: 'left' }}>
                <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
                <div>
                  <strong>Notice:</strong> If an account exists with this email, a password reset link has been sent. Please check your inbox and spam folder.
                </div>
              </div>

              {demoToken && (
                <div style={{
                  background: 'rgba(99, 102, 241, 0.08)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  marginBottom: '1.5rem',
                  fontSize: '0.85rem'
                }}>
                  <div style={{ color: '#a5b4fc', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Simulated Email Link:
                  </div>
                  <Link
                    to={`/reset-password?token=${demoToken}`}
                    id="link-simulated-reset"
                    style={{ wordBreak: 'break-all', color: '#818cf8', textDecoration: 'underline' }}
                  >
                    Click to Open Reset Password Page
                  </Link>
                </div>
              )}

              <Link to="/login" className="btn btn-secondary btn-full">
                <ArrowLeft size={16} /> Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="forgot-email">Account Email</label>
                <div className="form-input-wrapper">
                  <Mail size={17} className="form-input-icon left" />
                  <input
                    id="forgot-email"
                    type="email"
                    className="form-input has-prefix-icon"
                    placeholder="name@organization.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full btn-lg"
                id="btn-send-reset"
                disabled={loading}
              >
                {loading ? 'Sending reset link...' : 'Send Reset Link'}
                {!loading && <ArrowRight size={18} />}
              </button>

              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <Link to="/login" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <ArrowLeft size={14} /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

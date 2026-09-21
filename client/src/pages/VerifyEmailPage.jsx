import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Mail, CheckCircle2, Clock, RefreshCw, ArrowRight, AlertCircle, LogOut } from 'lucide-react';

export const VerifyEmailPage = () => {
  const { user, isEmailVerified, verifyEmail, resendVerification, refreshUser, logout, getDashboardRouteForRole } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [cooldown, setCooldown] = useState(0);
  const [loadingResend, setLoadingResend] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [manualToken, setManualToken] = useState(searchParams.get('token') || '');

  // If already verified, route to dashboard
  useEffect(() => {
    if (isEmailVerified && user) {
      navigate(getDashboardRouteForRole(user.role), { replace: true });
    }
  }, [isEmailVerified, user, navigate, getDashboardRouteForRole]);

  // Handle URL token auto-verification
  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      handleVerify(urlToken);
    }
  }, [searchParams]);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  const handleVerify = async (tokenToUse) => {
    setError('');
    setMessage('');
    setVerifying(true);

    try {
      const res = await verifyEmail(tokenToUse || manualToken || user?.verificationToken);
      if (res.success) {
        setMessage('Email verified successfully! Redirecting to your dashboard...');
        setTimeout(() => {
          navigate(getDashboardRouteForRole(user?.role || 'student'), { replace: true });
        }, 1500);
      }
    } catch (err) {
      setError(err.message || 'Verification failed. Please check the token or request a new email.');
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setError('');
    setMessage('');
    setLoadingResend(true);

    try {
      const res = await resendVerification(user?.email);
      setMessage(res.message || 'A new verification email has been sent.');
      setCooldown(res.cooldown || 60);
      if (res.demoVerificationToken) {
        setManualToken(res.demoVerificationToken);
      }
    } catch (err) {
      if (err.status === 429 && err.data?.remainingSeconds) {
        setCooldown(err.data.remainingSeconds);
        setError(err.message);
      } else {
        setError(err.message || 'Failed to resend verification email.');
      }
    } finally {
      setLoadingResend(false);
    }
  };

  const handleLogoutAndChangeEmail = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 70px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '520px', width: '100%' }}>
        <div className="card" id="verify-email-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(99, 102, 241, 0.15)',
            color: '#818cf8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            border: '1px solid rgba(99, 102, 241, 0.3)'
          }}>
            <Mail size={32} />
          </div>

          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.6rem', color: '#fff' }}>
            Verify Your Email
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            To protect your account and unlock access to SkillNexus, please verify your email address:
          </p>

          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '1.75rem',
            display: 'inline-block',
            fontWeight: 600,
            color: '#fff',
            fontSize: '1rem'
          }}>
            {user?.email || 'your-email@domain.com'}
          </div>

          {message && (
            <div className="alert-box alert-success" id="verify-success-alert" style={{ textAlign: 'left' }}>
              <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
              <div>{message}</div>
            </div>
          )}

          {error && (
            <div className="alert-box alert-error" id="verify-error-alert" style={{ textAlign: 'left' }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <div>{error}</div>
            </div>
          )}

          {/* Quick Verification Demo Action */}
          <div style={{
            background: 'rgba(99, 102, 241, 0.08)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            marginBottom: '1.5rem',
            textAlign: 'left'
          }}>
            <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#a5b4fc', marginBottom: '0.5rem' }}>
              One-Click Verification (Demo Simulation)
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
              Simulates opening the secure email link delivered to your inbox.
            </p>
            <button
              onClick={() => handleVerify(manualToken || user?.verificationToken)}
              className="btn btn-primary btn-full"
              id="btn-simulate-verify"
              disabled={verifying}
            >
              {verifying ? 'Verifying...' : 'Verify Email & Continue'}
              {!verifying && <ArrowRight size={17} />}
            </button>
          </div>

          {/* Resend Cooldown Section (FR-04) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button
              onClick={handleResend}
              className="btn btn-secondary btn-full"
              id="btn-resend-verification"
              disabled={cooldown > 0 || loadingResend}
            >
              <RefreshCw size={16} className={loadingResend ? 'spin' : ''} />
              {cooldown > 0
                ? `Resend available in ${cooldown}s`
                : (loadingResend ? 'Sending verification email...' : 'Resend Verification Email')}
            </button>

            <button
              onClick={handleLogoutAndChangeEmail}
              className="btn btn-outline btn-full"
              id="btn-change-email"
              style={{ fontSize: '0.85rem' }}
            >
              <LogOut size={15} /> Log Out / Use a Different Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

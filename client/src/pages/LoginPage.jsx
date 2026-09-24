import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle, Sparkles, CheckCircle } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login, loginWithGoogle, loginWithGithub, loginAsDemoRole, getDashboardRouteForRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const demoAccounts = [
    { label: 'Student', roleKey: 'student', email: 'student@skillnexus.com', pass: 'Student@1234', icon: '🎓', badge: 'Alex Rivera' },
    { label: 'Industry', roleKey: 'industry', email: 'industry@skillnexus.com', pass: 'Industry@1234', icon: '🏢', badge: 'TechCorp' },
    { label: 'Faculty', roleKey: 'academician', email: 'academician@skillnexus.com', pass: 'Faculty@1234', icon: '🔬', badge: 'Dr. Vance' },
    { label: 'Institution', roleKey: 'institution', email: 'institution@skillnexus.com', pass: 'Institute@1234', icon: '🏛️', badge: 'MetroTech' },
    { label: 'Admin', roleKey: 'admin', email: 'admin@skillnexus.com', pass: 'Admin@1234', icon: '🛡️', badge: 'Nexus Admin' }
  ];

  const handleQuickDemoLogin = async (acc) => {
    setEmail(acc.email);
    setPassword(acc.pass);
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await login(acc.email, acc.pass, true);
      const user = res.user;
      const from = location.state?.from?.pathname;
      if (from && !from.includes('/login')) {
        navigate(from);
      } else {
        navigate(getDashboardRouteForRole(user.role));
      }
    } catch (err) {
      const fallback = loginAsDemoRole(acc.roleKey);
      if (fallback?.user) {
        navigate(getDashboardRouteForRole(fallback.user.role));
      } else {
        setErrorMessage(err.message || 'Login failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (acc) => {
    setEmail(acc.email);
    setPassword(acc.pass);
    setErrorMessage('');
  };

  const handleOAuthSuccess = (user) => {
    const from = location.state?.from?.pathname;
    if (from && !from.includes('/login')) {
      navigate(from);
    } else {
      navigate(getDashboardRouteForRole(user.role));
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage('');
    setLoading(true);
    try {
      const res = await loginWithGoogle('student');
      handleOAuthSuccess(res.user);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to sign in with Google Firebase.');
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setErrorMessage('');
    setLoading(true);
    try {
      const res = await loginWithGithub('student');
      handleOAuthSuccess(res.user);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to sign in with GitHub Firebase.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const res = await login(email, password, rememberMe);
      const user = res.user;

      if (!user.emailVerified && user.role !== 'admin') {
        navigate('/verify-email');
      } else {
        const from = location.state?.from?.pathname;
        if (from && !from.includes('/login')) {
          navigate(from);
        } else {
          navigate(getDashboardRouteForRole(user.role));
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Incorrect email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-wrapper">
      {/* Left Brand Showcase Panel */}
      <div className="auth-hero-panel">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 0.9rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '2rem', backdropFilter: 'blur(8px)' }}>
            <Sparkles size={16} style={{ color: '#818cf8' }} /> Intelligent Career & Academia Ecosystem
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: '1.25rem', color: '#ffffff' }}>
            Bridge Your Skills<br />to Your Future.
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255, 255, 255, 0.8)', maxWidth: '440px', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            Connect verified skills, personalized learning, industry internships and career placements through one intelligent platform.
          </p>

          {/* Key Value Propositions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '440px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px', color: '#a5b4fc' }}>
                <CheckCircle size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#fff' }}>AI-Powered Skill Mapping</div>
                <div style={{ fontSize: '0.825rem', color: 'rgba(255, 255, 255, 0.7)' }}>Analyze proficiencies, identify curriculum gaps, and follow precision learning pathways.</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px', color: '#6ee7b7' }}>
                <CheckCircle size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#fff' }}>Explainable Industry Matching</div>
                <div style={{ fontSize: '0.825rem', color: 'rgba(255, 255, 255, 0.7)' }}>Transparent match percentages with exact matched skills and missing criteria breakdown.</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px', color: '#fde68a' }}>
                <CheckCircle size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#fff' }}>Academia–Industry Collaboration Hub</div>
                <div style={{ fontSize: '0.825rem', color: 'rgba(255, 255, 255, 0.7)' }}>Empower faculty training, FDPs, joint research projects, and campus recruitment.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Trust Footer */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.12)', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.65)' }}>
          <span>Enterprise Role-Based Access Control</span>
          <span>Verified Security Protocols</span>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <div className="card" id="login-card" style={{ padding: '2.5rem 2.25rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <h2 className="card-heading" style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>
                Welcome Back
              </h2>
              <p className="body-text" style={{ fontSize: '0.9rem' }}>
                Sign in to your SkillNexus AI account
              </p>
            </div>

            {errorMessage && (
              <div className="alert-box alert-error" id="login-error-alert">
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>{errorMessage}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} id="login-form">
              {/* Email */}
              <div className="form-group">
                <label className="form-label" htmlFor="login-email">Email Address</label>
                <div className="form-input-wrapper">
                  <Mail size={17} className="form-input-icon left" />
                  <input
                    id="login-email"
                    type="email"
                    className="form-input has-prefix-icon"
                    placeholder="name@organization.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label" htmlFor="login-password">Password</label>
                  <Link
                    to="/forgot-password"
                    id="link-forgot-password"
                    style={{ fontSize: '0.8rem', color: 'var(--primary)' }}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="form-input-wrapper">
                  <Lock size={17} className="form-input-icon left" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-input has-prefix-icon has-suffix-icon"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    disabled={loading}
                    required
                  />
                  <div
                    className="form-input-icon right"
                    id="toggle-show-password"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </div>
                </div>
              </div>

              {/* Remember Me */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                <label className="form-checkbox-label">
                  <input
                    type="checkbox"
                    id="remember-session"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember this device</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary btn-full btn-lg"
                id="btn-submit-login"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Sign In'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            {/* Quick Demo Credentials Autofill */}
            <div style={{
              marginTop: '1.25rem',
              padding: '0.85rem',
              background: 'rgba(99, 102, 241, 0.07)',
              border: '1px solid rgba(99, 102, 241, 0.22)',
              borderRadius: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <Sparkles size={14} /> Quick Demo Accounts
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Click any role to sign in instantly</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))', gap: '0.45rem' }}>
                {demoAccounts.map((acc) => {
                  const isSelected = email === acc.email;
                  return (
                    <button
                      key={acc.label}
                      type="button"
                      onClick={() => handleQuickDemoLogin(acc)}
                      id={`btn-demo-${acc.label.toLowerCase()}`}
                      disabled={loading}
                      title={`Instant 1-Click Login as ${acc.label}`}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: '0.15rem',
                        padding: '0.5rem 0.6rem',
                        borderRadius: '8px',
                        border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border)',
                        background: isSelected ? 'rgba(99, 102, 241, 0.18)' : 'var(--bg-card)',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600, fontSize: '0.78rem', color: 'var(--text-primary)' }}>
                        <span>{acc.icon}</span> {acc.label}
                      </div>
                      <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>
                        {acc.badge} <span style={{ color: 'var(--primary)', fontWeight: 600 }}>⚡</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Social Auth Divider */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '1.25rem 0 1rem 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
              <span style={{ padding: '0 0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>or sign in with</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
            </div>

            {/* Firebase OAuth Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem', padding: '0.65rem' }}
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem', padding: '0.65rem' }}
                onClick={handleGithubLogin}
                disabled={loading}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                GitHub
              </button>
            </div>

            {/* Registration Link */}
            <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Don't have an account?{' '}
              <Link to="/register" id="link-goto-register" style={{ fontWeight: 600, color: 'var(--primary)' }}>
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

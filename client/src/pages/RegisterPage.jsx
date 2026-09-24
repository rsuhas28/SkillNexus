import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { RoleCardSelector } from '../components/RoleCardSelector.jsx';
import { PasswordStrengthMeter } from '../components/PasswordStrengthMeter.jsx';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role');
  const [role, setRole] = useState(initialRole && ['student', 'industry', 'academician', 'institution'].includes(initialRole) ? initialRole : 'student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { register, loginWithGoogle, loginWithGithub, loginAsDemoRole, getDashboardRouteForRole } = useAuth();
  const navigate = useNavigate();

  const demoAccounts = [
    { label: 'Student', roleKey: 'student', email: 'student@skillnexus.com', icon: '🎓', badge: 'Alex Rivera' },
    { label: 'Industry', roleKey: 'industry', email: 'industry@skillnexus.com', icon: '🏢', badge: 'TechCorp' },
    { label: 'Faculty', roleKey: 'academician', email: 'academician@skillnexus.com', icon: '🔬', badge: 'Dr. Vance' },
    { label: 'Institution', roleKey: 'institution', email: 'institution@skillnexus.com', icon: '🏛️', badge: 'MetroTech' }
  ];

  const handleQuickDemoLogin = (acc) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const fallback = loginAsDemoRole(acc.roleKey);
      if (fallback?.user) {
        navigate(getDashboardRouteForRole(fallback.user.role));
      }
    } catch (err) {
      setErrorMessage(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthRegister = async (provider) => {
    setErrorMessage('');
    setLoading(true);
    try {
      const res = provider === 'google' 
        ? await loginWithGoogle(role) 
        : await loginWithGithub(role);
      navigate(getDashboardRouteForRole(res.user.role));
    } catch (err) {
      setErrorMessage(err.message || `Failed to sign up with ${provider}.`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Field validations
    if (!name.trim()) {
      setErrorMessage('Please enter your full name or organization name.');
      return;
    }

    if (!email.trim()) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!role) {
      setErrorMessage('Please select your role.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Password and Confirm Password do not match.');
      return;
    }

    if (!termsAccepted) {
      setErrorMessage('You must accept the Terms & Conditions and Privacy Policy.');
      return;
    }

    setLoading(true);

    try {
      const res = await register({
        name: name.trim(),
        email: email.trim(),
        password,
        confirmPassword,
        role,
        termsAccepted
      });

      // On static/demo deploy the user comes back already verified — go straight to dashboard
      if (res?.user?.emailVerified) {
        navigate(getDashboardRouteForRole(res.user.role));
      } else {
        navigate('/verify-email', { state: { email: email.trim(), newlyRegistered: true } });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please verify your details.');
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
      padding: '2.5rem 1rem'
    }}>
      <div style={{ maxWidth: '680px', width: '100%' }}>
        <div className="card" id="register-card" style={{ padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 className="page-heading" style={{ fontSize: '1.85rem', marginBottom: '0.4rem' }}>
              Create Your SkillNexus AI Account
            </h1>
            <p className="body-text" style={{ fontSize: '0.925rem' }}>
              Select your role and enter your details to join the ecosystem
            </p>
          </div>

          {errorMessage && (
            <div className="alert-box alert-error" id="register-error-alert">
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} id="register-form">
            {/* 1. Role Selection (FR-06) */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label className="form-label" style={{ marginBottom: '0.75rem', display: 'block' }}>
                1. Select Your Role <span style={{ color: '#f43f5e' }}>*</span>
              </label>
              <RoleCardSelector
                selectedRole={role}
                onSelectRole={(selectedId) => setRole(selectedId)}
              />
            </div>

            {/* 2. Full Name / Organization */}
            <div className="form-group">
              <label className="form-label" htmlFor="register-name">
                Full Name / Organization Name <span style={{ color: '#f43f5e' }}>*</span>
              </label>
              <div className="form-input-wrapper">
                <User size={17} className="form-input-icon left" />
                <input
                  id="register-name"
                  type="text"
                  className="form-input has-prefix-icon"
                  placeholder={role === 'industry' ? 'e.g., TechCorp Solutions' : (role === 'institution' ? 'e.g., Apex University' : 'e.g., Jane Doe')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* 3. Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="register-email">
                Official Email Address <span style={{ color: '#f43f5e' }}>*</span>
              </label>
              <div className="form-input-wrapper">
                <Mail size={17} className="form-input-icon left" />
                <input
                  id="register-email"
                  type="email"
                  className="form-input has-prefix-icon"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* 4. Password & Password Strength Meter (FR-02) */}
            <div className="form-group">
              <label className="form-label" htmlFor="register-password">
                Password <span style={{ color: '#f43f5e' }}>*</span>
              </label>
              <div className="form-input-wrapper">
                <Lock size={17} className="form-input-icon left" />
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input has-prefix-icon has-suffix-icon"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={loading}
                  required
                />
                <div
                  className="form-input-icon right"
                  id="toggle-register-password"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </div>
              </div>
              <PasswordStrengthMeter password={password} />
            </div>

            {/* 5. Confirm Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="register-confirm-password">
                Confirm Password <span style={{ color: '#f43f5e' }}>*</span>
              </label>
              <div className="form-input-wrapper">
                <Lock size={17} className="form-input-icon left" />
                <input
                  id="register-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input has-prefix-icon"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={loading}
                  required
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <span className="form-error-msg">Passwords do not match</span>
              )}
            </div>

            {/* 6. Terms & Conditions */}
            <div style={{ margin: '1.5rem 0' }}>
              <label className="form-checkbox-label">
                <input
                  type="checkbox"
                  id="register-terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  required
                />
                <span>
                  I agree to the <a href="#terms">Terms & Conditions</a>, <a href="#privacy">Privacy Policy</a>, and understand my role governance.
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              id="btn-submit-register"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Complete Registration'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* Quick Demo Credentials Autofill & 1-Click Access */}
          <div style={{
            marginTop: '1.25rem',
            padding: '0.85rem',
            background: 'rgba(99, 102, 241, 0.07)',
            border: '1px solid rgba(99, 102, 241, 0.22)',
            borderRadius: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <CheckCircle2 size={14} /> Quick Demo Accounts
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Click any role to enter instantly</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))', gap: '0.45rem' }}>
              {demoAccounts.map((acc) => (
                <button
                  key={acc.label}
                  type="button"
                  onClick={() => handleQuickDemoLogin(acc)}
                  id={`btn-reg-demo-${acc.label.toLowerCase()}`}
                  disabled={loading}
                  title={`Instant 1-Click Login as ${acc.label}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '0.15rem',
                    padding: '0.5rem 0.6rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-card)',
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
              ))}
            </div>
          </div>

          {/* Social Auth Divider */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0 1rem 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
            <span style={{ padding: '0 0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>or register with</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
          </div>

          {/* Firebase OAuth Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem', padding: '0.65rem' }}
              onClick={() => handleOAuthRegister('google')}
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
              onClick={() => handleOAuthRegister('github')}
              disabled={loading}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              GitHub
            </button>
          </div>

          <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Already registered?{' '}
            <Link to="/login" id="link-goto-login" style={{ fontWeight: 600, color: 'var(--primary)' }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

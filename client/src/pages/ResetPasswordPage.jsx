import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { PasswordStrengthMeter } from '../components/PasswordStrengthMeter.jsx';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Missing or invalid password reset token. Please request a new link.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await api.resetPassword({
        token,
        password,
        confirmPassword
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to reset password. The link may have expired.');
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
        <div className="card" id="reset-password-card" style={{ padding: '2.25rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.4rem', color: '#fff' }}>
              Create New Password
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Enter and confirm your new secure password
            </p>
          </div>

          {error && (
            <div className="alert-box alert-error">
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <div>{error}</div>
            </div>
          )}

          {success ? (
            <div style={{ textAlign: 'center' }}>
              <div className="alert-box alert-success" style={{ textAlign: 'left' }}>
                <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
                <div>
                  Your password has been successfully reset! You can now log in using your new credentials.
                </div>
              </div>

              <Link to="/login" className="btn btn-primary btn-full btn-lg" id="btn-goto-login">
                Proceed to Sign In <ArrowRight size={18} />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} id="reset-password-form">
              {!token && (
                <div className="alert-box alert-warning">
                  No reset token detected in URL. Please use the link sent to your email.
                </div>
              )}

              {/* Password */}
              <div className="form-group">
                <label className="form-label" htmlFor="reset-new-password">New Password</label>
                <div className="form-input-wrapper">
                  <Lock size={17} className="form-input-icon left" />
                  <input
                    id="reset-new-password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-input has-prefix-icon has-suffix-icon"
                    placeholder="Enter new strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                  <div
                    className="form-input-icon right"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </div>
                </div>
                <PasswordStrengthMeter password={password} />
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label className="form-label" htmlFor="reset-confirm-password">Confirm New Password</label>
                <div className="form-input-wrapper">
                  <Lock size={17} className="form-input-icon left" />
                  <input
                    id="reset-confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-input has-prefix-icon"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <span className="form-error-msg">Passwords do not match</span>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full btn-lg"
                id="btn-submit-reset"
                disabled={loading || !token}
              >
                {loading ? 'Updating password...' : 'Update Password'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

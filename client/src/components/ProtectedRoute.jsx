import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ShieldAlert, AlertTriangle, LogOut } from 'lucide-react';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading, isEmailVerified, accountStatus, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(99, 102, 241, 0.2)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Verifying session security...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // 1. Authentication Guard (FR-08)
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Account Status Guard (FR-10)
  if (accountStatus === 'suspended' || accountStatus === 'blocked') {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="card" style={{ maxWidth: '480px', width: '100%', textAlign: 'center', borderColor: 'rgba(239, 68, 68, 0.4)' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <AlertTriangle size={32} />
          </div>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.75rem', color: '#fff' }}>
            Account {accountStatus === 'suspended' ? 'Suspended' : 'Blocked'}
          </h2>
          <div className="alert-box alert-error" style={{ textAlign: 'left' }}>
            <p>
              Your SkillNexus account has been {accountStatus}. Please contact support at <a href="mailto:support@skillnexus.com" style={{ textDecoration: 'underline' }}>support@skillnexus.com</a> to appeal or restore your access.
            </p>
          </div>
          <button onClick={logout} className="btn btn-secondary btn-full">
            <LogOut size={16} /> Return to Login
          </button>
        </div>
      </div>
    );
  }

  // 3. Email Verification Guard (FR-04, FR-08)
  // Admin is exempt from email block if needed, but standard users must verify
  if (!isEmailVerified && user.role !== 'admin') {
    return <Navigate to="/verify-email" replace />;
  }

  // 4. Role Guard (FR-08, FR-09)
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/access-denied" state={{ attemptedRole: user.role }} replace />;
  }

  return children;
};

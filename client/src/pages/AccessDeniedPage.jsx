import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ShieldAlert, ArrowLeft, LayoutDashboard, LogOut } from 'lucide-react';
import { RoleBadge } from '../components/RoleBadge.jsx';

export const AccessDeniedPage = () => {
  const { user, getDashboardRouteForRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const targetDashboard = user ? getDashboardRouteForRole(user.role) : '/login';

  return (
    <div style={{
      minHeight: 'calc(100vh - 70px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '480px', width: '100%' }}>
        <div className="card" id="access-denied-card" style={{ padding: '2.5rem', textAlign: 'center', borderColor: 'rgba(225, 29, 72, 0.4)' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(225, 29, 72, 0.15)',
            color: '#f43f5e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            border: '1px solid rgba(225, 29, 72, 0.3)'
          }}>
            <ShieldAlert size={32} />
          </div>

          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: '#fff' }}>
            Access Denied
          </h1>

          <div className="alert-box alert-error" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
            <div>
              <strong>403 Forbidden:</strong> You don't have permission to access this page. This section requires a different authorization role.
            </div>
          </div>

          {user && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '1.75rem',
              fontSize: '0.875rem'
            }}>
              <div style={{ color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Your current signed-in role:</div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <RoleBadge role={user.role} />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to={targetDashboard} className="btn btn-primary btn-full" id="btn-back-to-dashboard">
              <LayoutDashboard size={17} />
              Return to Your Dashboard
            </Link>

            <button onClick={handleLogout} className="btn btn-outline btn-full" id="btn-denied-logout">
              <LogOut size={16} /> Sign In with Another Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

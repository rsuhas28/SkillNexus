import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { RoleBadge } from './RoleBadge.jsx';
import { ThemeToggle } from './ThemeToggle.jsx';
import { LogOut, Layers, User as UserIcon, ShieldAlert } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout, getDashboardRouteForRole, accountStatus } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const dashboardRoute = user ? getDashboardRouteForRole(user.role) : '/login';

  return (
    <header className="navbar" id="main-navbar">
      <Link to="/" className="brand-logo" id="nav-brand-logo">
        <div className="brand-icon">
          <Layers size={20} />
        </div>
        <span>SkillNexus</span>
        <span className="brand-tagline-chip">Bridging Skills, Academia & Industry</span>
      </Link>

      <div className="nav-links">
        {isAuthenticated && user ? (
          <>
            <Link to={dashboardRoute} className="nav-item" id="nav-dashboard-link">
              Dashboard
            </Link>

            {user.role !== 'admin' && (
              <Link to={`/${user.role}/profile`} className="nav-item" id="nav-profile-link">
                Profile
              </Link>
            )}

            {user.role === 'admin' && (
              <Link to="/admin/users" className="nav-item" id="nav-admin-users-link">
                User Management
              </Link>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '0.5rem', borderLeft: '1px solid var(--border-subtle)' }}>
              <ThemeToggle />
              <RoleBadge role={user.role} />
              
              <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.8rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.725rem' }}>{user.email}</span>
              </div>

              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                id="btn-nav-logout"
                title="Log Out"
                style={{ padding: '0.4rem 0.6rem' }}
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/" className="nav-item">Platform</Link>
            <ThemeToggle />
            <Link to="/login" className="btn btn-outline btn-sm" id="btn-nav-login">
              Log In
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm" id="btn-nav-register">
              Get Started
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

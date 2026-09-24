import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { RoleBadge } from './RoleBadge.jsx';
import { ThemeToggle } from './ThemeToggle.jsx';
import { LogOut, Layers, User as UserIcon, ShieldAlert, Sparkles, ChevronDown } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout, getDashboardRouteForRole, loginAsDemoRole } = useAuth();
  const navigate = useNavigate();
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleDemoSelect = (roleKey) => {
    setShowDemoMenu(false);
    const res = loginAsDemoRole(roleKey);
    if (res?.user) {
      navigate(getDashboardRouteForRole(res.user.role));
    }
  };

  const demoRoles = [
    { key: 'student', label: 'Student', icon: '🎓', sub: 'Alex Rivera' },
    { key: 'industry', label: 'Industry', icon: '🏢', sub: 'TechCorp' },
    { key: 'academician', label: 'Faculty', icon: '🔬', sub: 'Dr. Vance' },
    { key: 'institution', label: 'Institution', icon: '🏛️', sub: 'MetroTech' },
    { key: 'admin', label: 'Admin', icon: '🛡️', sub: 'Nexus Admin' }
  ];

  const dashboardRoute = user ? getDashboardRouteForRole(user.role) : '/login';

  return (
    <header className="navbar" id="main-navbar">
      <Link to="/" className="brand-logo" id="nav-brand-logo">
        <div className="brand-icon">
          <Layers size={20} />
        </div>
        <span>SkillNexus <span style={{ color: 'var(--ai-accent)', fontSize: '0.9em' }}>AI</span></span>
        <span className="brand-tagline-chip">Bridge Your Skills to Your Future.</span>
      </Link>

      <div className="nav-links">
        {/* Instant Demo Switcher Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowDemoMenu(!showDemoMenu)}
            id="btn-nav-instant-demo"
            className="btn btn-secondary btn-sm"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.38rem 0.75rem',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(2, 132, 199, 0.15))',
              border: '1px solid rgba(99, 102, 241, 0.35)',
              fontWeight: 600,
              fontSize: '0.82rem',
              color: 'var(--primary)'
            }}
          >
            <Sparkles size={14} style={{ color: '#6366f1' }} />
            <span>Instant Demo</span>
            <ChevronDown size={14} />
          </button>

          {showDemoMenu && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '210px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-lg)',
                padding: '0.4rem',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem'
              }}
            >
              <div style={{ padding: '0.4rem 0.6rem 0.3rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Select Demo Role
              </div>
              {demoRoles.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => handleDemoSelect(r.key)}
                  id={`btn-nav-role-${r.key}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0.65rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: user?.role === r.key ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: 'var(--text-primary)',
                    fontSize: '0.825rem',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(99, 102, 241, 0.12)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = user?.role === r.key ? 'rgba(99, 102, 241, 0.15)' : 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>{r.icon}</span>
                    <span style={{ fontWeight: 600 }}>{r.label}</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{r.sub}</span>
                </button>
              ))}
            </div>
          )}
        </div>

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

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { RoleBadge, StatusBadge } from './RoleBadge.jsx';
import {
  LayoutDashboard,
  UserCheck,
  Award,
  Compass,
  BookOpenCheck,
  FileText,
  Briefcase,
  Users,
  Handshake,
  GraduationCap,
  BarChart3,
  Building,
  Shield,
  Sliders,
  LogOut,
  Sparkles
} from 'lucide-react';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Dynamic Navigation definitions based on PRD
  const getNavItems = () => {
    switch (user.role) {
      case 'student':
        return [
          { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
          { label: 'Profile', path: '/student/profile', icon: UserCheck },
          { label: 'Digital Portfolio', path: '/student/portfolio', icon: Sparkles },
          { label: 'Skills & Profile', path: '/student/skills', icon: Award },
          { label: 'Projects & Certs', path: '/student/projects-certs', icon: Briefcase },
          { label: 'Assessments', path: '/student/assessments', icon: BookOpenCheck },
          { label: 'Skill-Gap Analyzer', path: '/student/skill-gap', icon: Sliders },
          { label: 'AI Mock Interview', path: '/student/ai-prep', icon: Sparkles },
          { label: 'Find Opportunities', path: '/opportunities', icon: Compass },
          { label: 'My Applications', path: '/student/applications', icon: FileText }
        ];
      case 'industry':
        return [
          { label: 'Dashboard', path: '/industry/dashboard', icon: LayoutDashboard },
          { label: 'Company Profile', path: '/industry/profile', icon: Building },
          { label: 'Trust & Verification', path: '/industry/verification', icon: Shield },
          { label: 'My Opportunities', path: '/industry/opportunities', icon: Briefcase },
          { label: 'Explore Opportunities', path: '/opportunities', icon: Compass },
          { label: 'Collaborations', path: '/academician/collaborations', icon: Handshake }
        ];
      case 'academician':
        return [
          { label: 'Dashboard', path: '/academician/dashboard', icon: LayoutDashboard },
          { label: 'Faculty Profile', path: '/academician/profile', icon: UserCheck },
          { label: 'Faculty Programs', path: '/academician/opportunities', icon: Briefcase },
          { label: 'Collaborations', path: '/academician/collaborations', icon: Handshake },
          { label: 'Explore Opportunities', path: '/opportunities', icon: Compass }
        ];
      case 'institution':
        return [
          { label: 'Dashboard', path: '/institution/dashboard', icon: LayoutDashboard },
          { label: 'Institution Profile', path: '/institution/profile', icon: Building },
          { label: 'Campus Analytics', path: '/institution/analytics', icon: BarChart3 },
          { label: 'Collaborations', path: '/academician/collaborations', icon: Handshake }
        ];
      case 'admin':
        return [
          { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
          { label: 'Users & Roles', path: '/admin/users', icon: Users },
          { label: 'Company Verifications', path: '/admin/verifications', icon: Shield },
          { label: 'Trust & Moderation', path: '/admin/moderation', icon: Sliders },
          { label: 'Platform Analytics', path: '/institution/analytics', icon: BarChart3 }
        ];
      default:
        return [];
    }
  };


  const navItems = getNavItems();

  return (
    <aside className="sidebar" id="app-sidebar">
      <div>
        <div className="sidebar-role-badge">
          <div>
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.35rem' }}>
              <RoleBadge role={user.role} />
              <StatusBadge status={user.accountStatus} />
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>{user.name}</div>
          </div>
        </div>

        <nav className="sidebar-menu">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isPlaceholder = item.path.startsWith('#');

            if (isPlaceholder) {
              return (
                <div
                  key={idx}
                  className="sidebar-link"
                  style={{ opacity: 0.65, cursor: 'not-allowed' }}
                  title={`${item.label} (Scheduled for ${item.badge || 'Future Phase'})`}
                >
                  <Icon size={18} />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge && (
                    <span style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.08)', padding: '0.15rem 0.4rem', borderRadius: '4px', color: 'var(--text-muted)' }}>
                      {item.badge}
                    </span>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={idx}
                to={item.path}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                id={`sidebar-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
        <button
          onClick={handleLogout}
          className="btn btn-secondary btn-full"
          id="sidebar-btn-logout"
          style={{ justifyContent: 'flex-start', padding: '0.75rem 1rem' }}
        >
          <LogOut size={17} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

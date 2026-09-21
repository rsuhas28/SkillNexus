import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { RoleBadge } from '../../components/RoleBadge.jsx';
import {
  GraduationCap,
  Users,
  BarChart3,
  Briefcase,
  Handshake,
  TrendingUp,
  Building,
  ArrowRight
} from 'lucide-react';

export const InstitutionDashboard = () => {
  const { user, profile } = useAuth();
  const completion = profile?.completionPercentage || 85;

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.15) 0%, rgba(245, 158, 11, 0.1) 100%)',
        border: '1px solid rgba(217, 119, 6, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <h1 style={{ fontSize: '1.85rem' }}>
              {profile?.institutionName || user?.name}
            </h1>
            <RoleBadge role="institution" />
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {profile?.institutionType || 'Tier-1 Technical University'} • Talent Development & Industry Collaboration Hub
          </p>
        </div>
        <Link to="/institution/profile" className="btn btn-primary" id="btn-edit-institution-profile">
          Manage Institution Profile <ArrowRight size={16} />
        </Link>
      </div>

      {/* Profile Completion */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
          <div style={{ fontWeight: 600 }}>Institution Partner Verification Readiness</div>
          <div style={{ color: '#fbbf24', fontWeight: 700 }}>{completion}%</div>
        </div>
        <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${completion}%`, background: 'linear-gradient(90deg, #d97706, #fbbf24)', transition: 'width 0.5s ease' }} />
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(2, 132, 199, 0.15)', color: '#38bdf8' }}>
            <GraduationCap size={24} />
          </div>
          <div>
            <div className="stat-value">2,847</div>
            <div className="stat-label">Total Students (Phase 9)</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(5, 150, 105, 0.15)', color: '#34d399' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="stat-value">312</div>
            <div className="stat-label">Faculty Members (Phase 9)</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="stat-value">84%</div>
            <div className="stat-label">Placement Rate (Phase 9)</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(217, 119, 6, 0.15)', color: '#fbbf24' }}>
            <Handshake size={24} />
          </div>
          <div>
            <div className="stat-value">18</div>
            <div className="stat-label">Industry MoUs (Phase 8)</div>
          </div>
        </div>
      </div>

      {/* Detail Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title"><TrendingUp size={18} color="#818cf8" /> Placement Progress</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phase 9 Analytics</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {[
              { dept: 'Computer Science', placed: 92, total: 120 },
              { dept: 'Electronics & VLSI', placed: 78, total: 95 },
              { dept: 'Mechanical Engineering', placed: 62, total: 88 }
            ].map((d, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                  <span>{d.dept}</span>
                  <span style={{ color: '#fbbf24', fontWeight: 600 }}>{Math.round(d.placed / d.total * 100)}% ({d.placed}/{d.total})</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.07)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${d.placed / d.total * 100}%`, background: 'linear-gradient(90deg, #d97706, #fbbf24)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title"><Handshake size={18} color="#34d399" /> Active Industry Partnerships</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {['TechCorp Solutions', 'Nexus Cloud Labs', 'Apex Robotics', 'DataVision AI'].map((co, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.85rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{co}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

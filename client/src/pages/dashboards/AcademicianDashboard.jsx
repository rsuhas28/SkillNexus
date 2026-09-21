import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { RoleBadge } from '../../components/RoleBadge.jsx';
import {
  BookOpen,
  FlaskConical,
  Award,
  Handshake,
  ArrowRight,
  Users,
  Briefcase
} from 'lucide-react';

export const AcademicianDashboard = () => {
  const { user, profile } = useAuth();
  const completion = profile?.completionPercentage || 80;

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%)',
        border: '1px solid rgba(5, 150, 105, 0.3)',
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
            <h1 style={{ fontSize: '1.85rem' }}>{user?.name}</h1>
            <RoleBadge role="academician" />
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {profile?.designation || 'Associate Professor'} •{' '}
            {profile?.department || 'Computer Science & Engineering'}
          </p>
        </div>
        <Link to="/academician/profile" className="btn btn-primary" id="btn-edit-academician-profile">
          Manage Faculty Profile <ArrowRight size={16} />
        </Link>
      </div>

      {/* Profile Completion */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
          <div style={{ fontWeight: 600 }}>Faculty Profile Completion & Industry Readiness</div>
          <div style={{ color: '#34d399', fontWeight: 700 }}>{completion}%</div>
        </div>
        <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${completion}%`, background: 'linear-gradient(90deg, #059669, #34d399)', transition: 'width 0.5s ease' }} />
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(5, 150, 105, 0.15)', color: '#34d399' }}>
            <Briefcase size={24} />
          </div>
          <div>
            <div className="stat-value">7</div>
            <div className="stat-label">Industry Opportunities (Phase 8)</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
            <Award size={24} />
          </div>
          <div>
            <div className="stat-value">3</div>
            <div className="stat-label">Upcoming FDPs (Phase 8)</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(2, 132, 199, 0.15)', color: '#38bdf8' }}>
            <FlaskConical size={24} />
          </div>
          <div>
            <div className="stat-value">2</div>
            <div className="stat-label">Research Collaborations (Phase 8)</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <Handshake size={24} />
          </div>
          <div>
            <div className="stat-value">4</div>
            <div className="stat-label">Consultancy Requests</div>
          </div>
        </div>
      </div>

      {/* Detail Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title"><FlaskConical size={18} color="#38bdf8" /> Research Areas</h3>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {(profile?.researchAreas || ['Distributed Systems', 'Applied AI', 'Cyber Security']).map((area, i) => (
              <span key={i} style={{ padding: '0.35rem 0.75rem', background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.3)', borderRadius: '6px', fontSize: '0.85rem', color: '#34d399' }}>
                {area}
              </span>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title"><Award size={18} color="#818cf8" /> Faculty Development Programs</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phase 8</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>AI for Educators — 5 Day Intensive</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>TechCorp Solutions • Jan 2027 • Sponsored</div>
            </div>
            <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Cloud Architecture Workshop</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Apex Labs • Mar 2027 • Registration Open</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { RoleBadge } from '../../components/RoleBadge.jsx';
import {
  Briefcase,
  Users,
  FileText,
  Handshake,
  ArrowRight,
  Sparkles,
  Building,
  CheckCircle2
} from 'lucide-react';

export const IndustryDashboard = () => {
  const { user, profile } = useAuth();
  const completion = profile?.completionPercentage || 75;

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
        border: '1px solid rgba(124, 58, 237, 0.3)',
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
              {profile?.companyName || user?.name}
            </h1>
            <RoleBadge role="industry" />
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px' }}>
            {profile?.industrySector || 'Enterprise Software & Cloud AI'} • Talent Acquisition & Collaboration Hub
          </p>
        </div>

        <Link to="/industry/profile" className="btn btn-primary" id="btn-edit-industry-profile">
          Manage Company Profile <ArrowRight size={16} />
        </Link>
      </div>

      {/* Profile Completion */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
          <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Company Partner Verification Readiness</div>
          <div style={{ color: '#a78bfa', fontWeight: 700 }}>{completion}% Completed</div>
        </div>
        <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${completion}%`, background: 'linear-gradient(90deg, #7c3aed, #a78bfa)', transition: 'width 0.5s ease' }} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(124, 58, 237, 0.15)', color: '#a78bfa' }}>
            <Briefcase size={24} />
          </div>
          <div>
            <div className="stat-value">4</div>
            <div className="stat-label">Active Opportunities</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
            <FileText size={24} />
          </div>
          <div>
            <div className="stat-value">38</div>
            <div className="stat-label">Applications Received</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(2, 132, 199, 0.15)', color: '#38bdf8' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="stat-value">142</div>
            <div className="stat-label">Recommended Candidates</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(5, 150, 105, 0.15)', color: '#34d399' }}>
            <Handshake size={24} />
          </div>
          <div>
            <div className="stat-value">6</div>
            <div className="stat-label">Institutional Collab Requests</div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title"><Briefcase size={18} color="#a78bfa" /> Active Opportunity Shells</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phase 7 Active</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Cloud Architecture Intern</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>18 Applicants • Closing in 14 days</div>
            </div>
            <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Junior Machine Learning Engineer</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>20 Applicants • In Review</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title"><Handshake size={18} color="#34d399" /> Academia–Industry Partnerships</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phase 8 Active</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Apex University • Distributed AI Lab</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Joint Research & Faculty Internship Proposal</div>
            </div>
            <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Metropolitan Institute • Placement MoU</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Annual Campus Hiring & Curriculum Review</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

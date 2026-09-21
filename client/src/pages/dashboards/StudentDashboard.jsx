import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { RoleBadge } from '../../components/RoleBadge.jsx';
import {
  Sparkles,
  Award,
  Compass,
  TrendingUp,
  Calendar,
  ArrowRight,
  BookOpen,
  Briefcase,
  CheckCircle2
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user, profile } = useAuth();

  const completion = profile?.completionPercentage || 65;

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
        border: '1px solid rgba(2, 132, 199, 0.3)',
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
            <h1 style={{ fontSize: '1.85rem' }}>Welcome back, {user?.name}!</h1>
            <RoleBadge role="student" />
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px' }}>
            {profile?.headline || 'Computer Science Undergrad | Aspiring Software Engineer'}
          </p>
        </div>

        <Link to="/student/profile" className="btn btn-primary" id="btn-edit-student-profile">
          Manage Profile <ArrowRight size={16} />
        </Link>
      </div>

      {/* Profile Completion Bar */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
          <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Profile Readiness for Industry Matching</div>
          <div style={{ color: '#38bdf8', fontWeight: 700 }}>{completion}% Completed</div>
        </div>
        <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${completion}%`, background: 'linear-gradient(90deg, #0284c7, #38bdf8)', transition: 'width 0.5s ease' }} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(2, 132, 199, 0.15)', color: '#38bdf8' }}>
            <Award size={24} />
          </div>
          <div>
            <div className="stat-value">{profile?.skills?.length || 5}</div>
            <div className="stat-label">Verified Skills (Phase 3)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
            <Compass size={24} />
          </div>
          <div>
            <div className="stat-value">12</div>
            <div className="stat-label">Recommended Opps (Phase 7)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="stat-value">92%</div>
            <div className="stat-label">Industry Readiness Index</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <Calendar size={24} />
          </div>
          <div>
            <div className="stat-value">3</div>
            <div className="stat-label">Upcoming Activities</div>
          </div>
        </div>
      </div>

      {/* Content Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Skills Placeholder */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title"><Award size={18} color="#38bdf8" /> Current Skill Highlights</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phase 3 Assessment Ready</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {(profile?.skills || ['JavaScript', 'React', 'Data Structures', 'Python', 'Git', 'SQL']).map((sk, i) => (
              <span key={i} style={{ padding: '0.35rem 0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '0.85rem', border: '1px solid var(--border-subtle)' }}>
                {sk}
              </span>
            ))}
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Automated skill verification and AI gap extraction will activate in subsequent platform phases.
          </p>
        </div>

        {/* Recommended Opportunities Placeholder */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title"><Compass size={18} color="#818cf8" /> Recommended Opportunities</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phase 7 Matching</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Full Stack Developer Intern</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>TechCorp Solutions • Hybrid • 3 Months</div>
            </div>
            <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Applied AI Research Associate</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Apex Robotics Labs • On-Site • 6 Months</div>
            </div>
          </div>
        </div>

        {/* Upcoming Activities Placeholder */}
        <div className="card" style={{ gridColumn: 'span 1' }}>
          <div className="card-header">
            <h3 className="card-title"><Calendar size={18} color="#fbbf24" /> Upcoming Activities</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
              <div style={{ fontSize: '0.875rem' }}>Campus Hackathon 2026 Registration Opens</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1' }} />
              <div style={{ fontSize: '0.875rem' }}>Industry Tech Talk: Cloud Microservices by TechCorp</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ fontSize: '0.875rem' }}>Mid-term Skill Readiness Review</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

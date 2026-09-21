import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  GraduationCap,
  Briefcase,
  BookOpen,
  Building2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Layers,
  KeyRound,
  CheckCircle2
} from 'lucide-react';

export const LandingPage = () => {
  const { isAuthenticated, user, getDashboardRouteForRole } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section style={{
        padding: '5rem 2rem 4rem',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          background: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '9999px',
          color: '#a5b4fc',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '1.75rem'
        }}>
          <Sparkles size={16} /> SkillNexus Platform • Phase 1 Identity & RBAC
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
          fontWeight: 800,
          letterSpacing: '-1.5px',
          marginBottom: '1.5rem',
          lineHeight: 1.15
        }}>
          Bridging <span style={{
            background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #38bdf8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Skills, Academia & Industry</span>
        </h1>

        <p style={{
          fontSize: '1.2rem',
          color: 'var(--text-secondary)',
          maxWidth: '750px',
          margin: '0 auto 2.5rem',
          lineHeight: 1.6
        }}>
          SkillNexus is the unified talent and collaboration ecosystem connecting students, educational institutions, academicians, and industry partners with enterprise-grade role-based access.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {isAuthenticated && user ? (
            <Link to={getDashboardRouteForRole(user.role)} className="btn btn-primary btn-lg">
              Go to Your Dashboard ({user.role}) <ArrowRight size={18} />
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary btn-lg" id="hero-btn-register">
                Get Started — Select Role <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg" id="hero-btn-login">
                Log In to Account
              </Link>
            </>
          )}
        </div>
      </section>

      {/* 4 Pillars Section */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Tailored Experiences for Every Stakeholder</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Phase 1 provides dedicated authentication boundaries, security middleware, and functional dashboard shells for all 5 roles.
          </p>
        </div>

        <div className="role-cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {/* Student */}
          <div className="card" style={{ borderColor: 'rgba(2, 132, 199, 0.3)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(2, 132, 199, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <GraduationCap size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Students</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Skill assessment, gap analysis, dynamic learning pathways, verified portfolio, and tailored internship opportunities.
            </p>
            <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 600 }}>Route: /student/dashboard</div>
          </div>

          {/* Industry */}
          <div className="card" style={{ borderColor: 'rgba(124, 58, 237, 0.3)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(124, 58, 237, 0.15)', color: '#a78bfa', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Briefcase size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Industry Partners</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Discover verified skill-matched candidates, post live challenges, internships, and initiate institutional research partnerships.
            </p>
            <div style={{ fontSize: '0.8rem', color: '#a78bfa', fontWeight: 600 }}>Route: /industry/dashboard</div>
          </div>

          {/* Academician */}
          <div className="card" style={{ borderColor: 'rgba(5, 150, 105, 0.3)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(5, 150, 105, 0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <BookOpen size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Academicians</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Connect with leading industries for joint research projects, Faculty Development Programs (FDPs), and consultancy.
            </p>
            <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600 }}>Route: /academician/dashboard</div>
          </div>

          {/* Institution */}
          <div className="card" style={{ borderColor: 'rgba(217, 119, 6, 0.3)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(217, 119, 6, 0.15)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Building2 size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Institutions</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Institutional dashboard tracking student skills, campus placements, faculty development, and industry MoUs.
            </p>
            <div style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 600 }}>Route: /institution/dashboard</div>
          </div>
        </div>
      </section>
    </div>
  );
};

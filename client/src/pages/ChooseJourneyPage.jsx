import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Briefcase, BookOpen, Building2, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export const ChooseJourneyPage = () => {
  const navigate = useNavigate();

  const journeys = [
    {
      role: 'student',
      title: 'Student',
      tagline: 'Bridge your learning to industry careers',
      description: 'Discover your skills, close your gaps and find opportunities.',
      icon: GraduationCap,
      color: '#0284c7',
      bgGlow: 'rgba(2, 132, 199, 0.1)',
      highlights: [
        'AI Skill Mapping & Radar Profile',
        'Transparent Skill Gap Diagnostics',
        'Verified Internship & Placement Matching'
      ],
      ctaText: 'Start as Student'
    },
    {
      role: 'industry',
      title: 'Industry',
      tagline: 'Hire verified, skill-ready talent directly',
      description: 'Find candidates with the skills your organization needs.',
      icon: Briefcase,
      color: '#7c3aed',
      bgGlow: 'rgba(124, 58, 237, 0.1)',
      highlights: [
        'Explainable Match Scores (e.g. 87% Match)',
        'Post High-Impact Internships & Jobs',
        'Academic Research & Live Projects'
      ],
      ctaText: 'Partner as Industry'
    },
    {
      role: 'academician',
      title: 'Academician',
      tagline: 'Connect pedagogy with enterprise innovation',
      description: 'Connect with industry training, FDPs, research and collaboration.',
      icon: BookOpen,
      color: '#059669',
      bgGlow: 'rgba(5, 150, 105, 0.1)',
      highlights: [
        'Faculty Industrial Training & FDPs',
        'Industry Consultancy & Joint Grants',
        'Guest Lectures & Hackathon Mentorship'
      ],
      ctaText: 'Join as Academician'
    },
    {
      role: 'institution',
      title: 'Institution',
      tagline: 'Empower placement outcomes with real-time analytics',
      description: 'Monitor skill development, internships and placement outcomes.',
      icon: Building2,
      color: '#d97706',
      bgGlow: 'rgba(217, 119, 6, 0.1)',
      highlights: [
        'Department-wide Skill Gap Heatmaps',
        'Real-time Placement Readiness Metrics',
        'Accreditation-Ready Outcome Reports'
      ],
      ctaText: 'Enroll Institution'
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3.5rem 1.5rem 5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          background: 'var(--ai-accent-light)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: 'var(--radius-full)',
          color: 'var(--primary)',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '1.25rem'
        }}>
          <Sparkles size={16} /> SkillNexus AI Collaboration Ecosystem
        </div>
        <h1 className="hero-heading" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', marginBottom: '1rem' }}>
          Choose your journey
        </h1>
        <p className="body-text" style={{ maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem' }}>
          SkillNexus AI delivers tailored pathways for every stakeholder. Select your role to unlock intelligent skill mapping and collaborative opportunities.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.5rem'
      }}>
        {journeys.map((j) => {
          const Icon = j.icon;
          return (
            <div
              key={j.role}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '2rem',
                border: '1.5px solid var(--border)',
                transition: 'all 0.25s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = j.color;
                e.currentTarget.style.boxShadow = `0 12px 30px ${j.bgGlow}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <div>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: 'var(--radius-md)',
                  background: j.bgGlow,
                  color: j.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <Icon size={28} />
                </div>

                <div style={{ fontSize: '0.78rem', color: j.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                  {j.role}
                </div>

                <h2 className="card-heading" style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>
                  {j.title}
                </h2>

                <p className="body-text" style={{ fontSize: '0.925rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                  {j.description}
                </p>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', marginBottom: '1.75rem' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
                    KEY CAPABILITIES
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {j.highlights.map((h, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <CheckCircle2 size={15} style={{ color: j.color, flexShrink: 0, marginTop: '2px' }} />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Link
                to={`/register?role=${j.role}`}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  background: j.color,
                  borderColor: j.color,
                  boxShadow: `0 4px 14px ${j.bgGlow}`
                }}
              >
                <span>{j.ctaText}</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

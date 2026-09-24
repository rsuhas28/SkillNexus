import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  GraduationCap,
  Briefcase,
  BookOpen,
  Building2,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Layers,
  CheckCircle2,
  ChevronRight,
  Search,
  TrendingUp,
  Cpu,
  BarChart3,
  Users,
  Compass,
  FileCheck,
  Award,
  Zap,
  Bot,
  Target,
  ExternalLink
} from 'lucide-react';

export const LandingPage = () => {
  const { isAuthenticated, user, getDashboardRouteForRole, loginAsDemoRole } = useAuth();
  const navigate = useNavigate();

  const handleInstantDemo = (roleKey) => {
    const res = loginAsDemoRole(roleKey);
    if (res?.user) {
      navigate(getDashboardRouteForRole(res.user.role));
    }
  };

  // Active step for interactive pipeline visual
  const [activePipelineStep, setActivePipelineStep] = useState(1);

  // Active collaboration tab
  const [activeCollabCategory, setActiveCollabCategory] = useState('Mentorship');

  const pipelineSteps = [
    {
      id: 0,
      title: 'Student Profile',
      subtitle: 'Dynamic Portfolio & Credentials',
      badge: '01',
      metric: '88% Complete',
      desc: 'Unified student identity with verified coursework, academic history, projects, and demonstrated abilities.',
      icon: GraduationCap,
      color: '#0284c7'
    },
    {
      id: 1,
      title: 'AI Skill Mapping',
      subtitle: 'Multi-Dimensional Assessment',
      badge: '02',
      metric: '18 Skills Assessed',
      desc: 'Technical, soft-skill, and quantitative aptitude evaluated to generate your comprehensive radar skill taxonomy.',
      icon: Cpu,
      color: '#6366f1'
    },
    {
      id: 2,
      title: 'Skill Gap Analysis',
      subtitle: 'Industry Benchmark Alignment',
      badge: '03',
      metric: '23% Gap Diagnosed',
      desc: 'Side-by-side comparison of current student proficiency against real-time market requirements for targeted roles.',
      icon: Target,
      color: '#f59e0b'
    },
    {
      id: 3,
      title: 'Precision Learning',
      subtitle: 'Targeted Pathways & Projects',
      badge: '04',
      metric: '3 Pathways Active',
      desc: 'Curated modules, practical coding challenges, and recommended certifications to close diagnosed gaps rapidly.',
      icon: BookOpen,
      color: '#10b981'
    },
    {
      id: 4,
      title: 'Internship Discovery',
      subtitle: 'Explainable Match Scoring',
      badge: '05',
      metric: '87% Skill Match',
      desc: 'Transparent AI matching connecting eligible students to verified industrial internships with zero guesswork.',
      icon: Briefcase,
      color: '#7c3aed'
    },
    {
      id: 5,
      title: 'Career Placement',
      subtitle: 'Hiring & Career Acceleration',
      badge: '06',
      metric: 'Verified Offer',
      desc: 'End-to-end recruitment pipeline, mock interview readiness, and transparent job offer outcomes.',
      icon: Award,
      color: '#059669'
    }
  ];

  const collaborationCategories = [
    {
      name: 'Mentorship',
      icon: Users,
      summary: '1-on-1 industry leader guidance for students and budding researchers.',
      stats: '1,200+ Active Mentors'
    },
    {
      name: 'Guest Lecture',
      icon: BookOpen,
      summary: 'Industry specialists conducting interactive sessions on cutting-edge technologies.',
      stats: '450+ Sessions Delivered'
    },
    {
      name: 'Workshop',
      icon: Zap,
      summary: 'Hands-on technical bootcamps on Cloud, AI/ML, DevOps, and Full-Stack.',
      stats: '320+ Practical Bootcamps'
    },
    {
      name: 'Innovation Challenge',
      icon: Target,
      summary: 'Industry-sponsored hackathons tackling real enterprise engineering problems.',
      stats: '85 Live Challenges'
    },
    {
      name: 'Live Project',
      icon: Layers,
      summary: 'Students building production modules under corporate mentorship.',
      stats: '600+ Completed Projects'
    },
    {
      name: 'Research',
      icon: Cpu,
      summary: 'Collaborative applied R&D and joint patent filings between faculty and tech firms.',
      stats: '140+ Joint Publications'
    },
    {
      name: 'Consultancy',
      icon: BarChart3,
      summary: 'Academic experts solving specialized business and technical bottlenecks.',
      stats: '$2.4M Consulting Value'
    },
    {
      name: 'Industrial Training',
      icon: Award,
      summary: 'Immersive corporate exposure for students and emerging researchers.',
      stats: '3,800+ Students Trained'
    },
    {
      name: 'FDP',
      icon: Sparkles,
      summary: 'Faculty Development Programs modernizing academic engineering curricula.',
      stats: '210+ Faculty Certified'
    }
  ];

  return (
    <div style={{ paddingBottom: '4rem', overflowX: 'hidden' }}>
      {/* ===================================================================
          1. HERO SECTION (Specification 6)
          =================================================================== */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '4rem 1.5rem 5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '3.5rem',
        alignItems: 'center'
      }}>
        {/* Left Hero Content */}
        <div>
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
            marginBottom: '1.75rem'
          }}>
            <Sparkles size={16} /> SkillNexus AI — Intelligent Career Platform
          </div>

          <h1 className="hero-heading" style={{ marginBottom: '1.5rem' }}>
            Bridge Your Skills to Your Future.
          </h1>

          <p className="body-text" style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.6, maxWidth: '580px' }}>
            AI-powered skill mapping, learning, internships and placement — connecting students, academia and industry through one intelligent platform.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {isAuthenticated && user ? (
              <Link to={getDashboardRouteForRole(user.role)} className="btn btn-primary btn-lg" id="btn-hero-dashboard">
                <span>Go to Your Dashboard</span>
                <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg" id="btn-hero-get-started">
                  <span>Get Started</span>
                  <ArrowRight size={18} />
                </Link>
                <Link to="/opportunities" className="btn btn-outline btn-lg" id="btn-hero-explore">
                  <span>Explore Opportunities</span>
                  <Search size={18} />
                </Link>
              </>
            )}
          </div>

          {/* Instant 1-Click Demo Bar */}
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(2, 132, 199, 0.08) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            borderRadius: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <Sparkles size={15} style={{ color: '#6366f1' }} /> ⚡ Instant Live Demo (1-Click Access)
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Explore full platform with zero sign-up</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(105px, 1fr))', gap: '0.5rem' }}>
              {[
                { key: 'student', label: 'Student', icon: '🎓', sub: 'Alex Rivera' },
                { key: 'industry', label: 'Industry', icon: '🏢', sub: 'TechCorp' },
                { key: 'academician', label: 'Faculty', icon: '🔬', sub: 'Dr. Vance' },
                { key: 'institution', label: 'Institution', icon: '🏛️', sub: 'MetroTech' }
              ].map((d) => (
                <button
                  key={d.key}
                  type="button"
                  onClick={() => handleInstantDemo(d.key)}
                  id={`btn-landing-demo-${d.key}`}
                  title={`Experience SkillNexus as ${d.label}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '0.15rem',
                    padding: '0.55rem 0.65rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-card)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                    <span>{d.icon}</span> {d.label}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    {d.sub} <span style={{ color: 'var(--primary)', fontWeight: 700 }}>⚡</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.5rem',
            marginTop: '3.5rem',
            paddingTop: '2rem',
            borderTop: '1px solid var(--border)'
          }}>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                94%
              </div>
              <div className="small-metadata">Placement Readiness</div>
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--ai-accent)', fontFamily: 'var(--font-heading)' }}>
                850+
              </div>
              <div className="small-metadata">Industry Partners</div>
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success)', fontFamily: 'var(--font-heading)' }}>
                Zero
              </div>
              <div className="small-metadata">Guesswork Matching</div>
            </div>
          </div>
        </div>

        {/* Right Hero Visual: Student Profile -> AI Skill Mapping -> Skill Gap -> Learning -> Internship -> Placement */}
        <div>
          <div className="flow-diagram-container" id="hero-flow-diagram">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Interactive Career Pipeline
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  From Enrolment to Career Placement
                </div>
              </div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.75rem',
                color: 'var(--success)',
                background: 'rgba(16, 185, 129, 0.1)',
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)' }}></span>
                Live Simulation
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {pipelineSteps.map((step, idx) => {
                const Icon = step.icon;
                const isActive = activePipelineStep === step.id;
                return (
                  <React.Fragment key={step.id}>
                    <div
                      className={`flow-step-item ${isActive ? 'active' : ''}`}
                      onClick={() => setActivePipelineStep(step.id)}
                      style={{
                        borderColor: isActive ? step.color : undefined,
                        background: isActive ? 'var(--surface)' : undefined
                      }}
                    >
                      <div
                        className="flow-step-badge"
                        style={{
                          backgroundColor: `${step.color}18`,
                          color: step.color
                        }}
                      >
                        <Icon size={18} />
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                            {step.title}
                          </div>
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            padding: '0.15rem 0.5rem',
                            borderRadius: 'var(--radius-full)',
                            background: `${step.color}15`,
                            color: step.color
                          }}>
                            {step.metric}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {step.subtitle}
                        </div>
                        {isActive && (
                          <div style={{ marginTop: '0.5rem', fontSize: '0.825rem', color: 'var(--text-primary)', lineHeight: 1.45, borderTop: '1px solid var(--border)', paddingTop: '0.5rem' }}>
                            {step.desc}
                          </div>
                        )}
                      </div>
                    </div>

                    {idx < pipelineSteps.length - 1 && (
                      <div className="flow-connector-line"></div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          2. PLATFORM OVERVIEW (Specification 7 #2)
          =================================================================== */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="section-heading" style={{ marginBottom: '0.75rem' }}>
            Unified Academia–Industry Collaboration
          </h2>
          <p className="body-text" style={{ maxWidth: '650px', margin: '0 auto' }}>
            SkillNexus AI integrates all core stakeholders into one real-time ecosystem, removing institutional silos between skill acquisition and commercial deployment.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Student */}
          <div className="card" style={{ borderTop: '3px solid #0284c7' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(2, 132, 199, 0.12)', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <GraduationCap size={24} />
            </div>
            <h3 className="card-heading" style={{ marginBottom: '0.5rem' }}>Students</h3>
            <p className="body-text" style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Discover skills, complete multi-dimensional assessments, close gaps with tailored pathways, and secure verified opportunities.
            </p>
            <Link to="/register?role=student" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0284c7', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              Start Student Journey <ChevronRight size={14} />
            </Link>
          </div>

          {/* Industry */}
          <div className="card" style={{ borderTop: '3px solid #7c3aed' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(124, 58, 237, 0.12)', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Briefcase size={24} />
            </div>
            <h3 className="card-heading" style={{ marginBottom: '0.5rem' }}>Industry</h3>
            <p className="body-text" style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Find candidates with exact verified skills, review transparent match breakdowns, post live projects, and access elite campus talent.
            </p>
            <Link to="/register?role=industry" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#7c3aed', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              Access Industry Portal <ChevronRight size={14} />
            </Link>
          </div>

          {/* Academician */}
          <div className="card" style={{ borderTop: '3px solid #059669' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(5, 150, 105, 0.12)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <BookOpen size={24} />
            </div>
            <h3 className="card-heading" style={{ marginBottom: '0.5rem' }}>Academician</h3>
            <p className="body-text" style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Engage with industrial training, faculty development programs (FDPs), consulting challenges, and joint grant research.
            </p>
            <Link to="/register?role=academician" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#059669', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              Join as Academician <ChevronRight size={14} />
            </Link>
          </div>

          {/* Institution */}
          <div className="card" style={{ borderTop: '3px solid #d97706' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(217, 119, 6, 0.12)', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Building2 size={24} />
            </div>
            <h3 className="card-heading" style={{ marginBottom: '0.5rem' }}>Institution</h3>
            <p className="body-text" style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Monitor student skill development, view department gap heatmaps, track internship outcomes, and export accreditation metrics.
            </p>
            <Link to="/register?role=institution" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#d97706', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              Institution Analytics <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===================================================================
          3. HOW SKILLNEXUS WORKS (Specification 7 #3)
          =================================================================== */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            Proven Methodology
          </div>
          <h2 className="section-heading" style={{ marginBottom: '0.75rem' }}>
            How SkillNexus AI Works
          </h2>
          <p className="body-text" style={{ maxWidth: '640px', margin: '0 auto' }}>
            An explainable, structured progression that replaces speculative resume screening with objective skill verification and data-driven matching.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2rem'
        }}>
          {[
            {
              step: '01',
              title: 'Assess & Taxonomy Mapping',
              desc: 'Students complete standardized technical assessments, aptitude evaluations, and verified project submissions to build a dynamic skill taxonomy.',
              icon: Cpu
            },
            {
              step: '02',
              title: 'AI Gap Diagnosis',
              desc: 'The AI engine evaluates student proficiencies against live job market data, spotlighting explicit strengths and required skill gaps.',
              icon: Target
            },
            {
              step: '03',
              title: 'Guided Remediation',
              desc: 'AI Career Copilot recommends prioritized learning pathways, coding exercises, and industry projects designed to systematically close the gap.',
              icon: Bot
            },
            {
              step: '04',
              title: 'Explainable Matching & Placement',
              desc: 'Verified candidate credentials match employer criteria with transparent score breakdowns (e.g. 87% Match) leading to direct interview pipelines.',
              icon: Award
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="card" style={{ position: 'relative' }}>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 900,
                  color: 'var(--border)',
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.5rem',
                  lineHeight: 1
                }}>
                  {item.step}
                </div>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--ai-accent-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <Icon size={22} />
                </div>
                <h3 className="card-heading" style={{ marginBottom: '0.65rem' }}>
                  {item.title}
                </h3>
                <p className="body-text" style={{ fontSize: '0.9rem' }}>
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===================================================================
          4. STUDENT JOURNEY INTERACTIVE SHOWCASE (Specification 7 #4)
          =================================================================== */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '3.5rem 1.5rem' }}>
        <div className="card" style={{
          padding: '3rem',
          background: 'linear-gradient(135deg, var(--surface) 0%, var(--surface-elevated) 100%)',
          border: '1px solid var(--border)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '3rem',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                End-to-End Progression
              </div>
              <h2 className="section-heading" style={{ marginBottom: '1rem' }}>
                The Student Advancement Journey
              </h2>
              <p className="body-text" style={{ marginBottom: '1.5rem' }}>
                Every student receives transparent feedback on what they know, what employers require, and exactly what to learn next to bridge the gap.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {[
                  'Circular profile readiness indicators updating in real time',
                  'Aptitude tests across Quantitative, Logical & Verbal reasoning',
                  'AI-curated learning paths & mock interview simulator',
                  'Direct application tracking through a transparent pipeline'
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.925rem' }}>
                    <CheckCircle2 size={18} style={{ color: 'var(--success)', flexShrink: 0 }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '2rem' }}>
                <Link to="/register?role=student" className="btn btn-primary">
                  Begin Your Journey <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Simulated Student Metric Card */}
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              boxShadow: 'var(--shadow-md)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                    Career Readiness Score
                  </div>
                  <div className="small-metadata">Target: Machine Learning Engineer</div>
                </div>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: 'rgba(37, 99, 235, 0.1)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.15rem'
                }}>
                  87%
                </div>
              </div>

              {/* Skill Bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { name: 'Python & Data Structures', current: 85, required: 90, gap: 5 },
                  { name: 'Machine Learning & Models', current: 78, required: 85, gap: 7 },
                  { name: 'SQL & Database Optimization', current: 65, required: 80, gap: 15 },
                  { name: 'Deep Learning / PyTorch', current: 42, required: 70, gap: 28 }
                ].map((s, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{s.current}% / {s.required}% req</span>
                    </div>
                    <div style={{ height: '7px', background: 'var(--border)', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${s.current}%`,
                        background: s.gap > 20 ? 'var(--warning)' : 'var(--primary)',
                        borderRadius: '9999px'
                      }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          5. INDUSTRY & RECRUITMENT BENEFITS (Specification 7 #5)
          =================================================================== */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '3.5rem 1.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '3rem',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#7c3aed', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              Enterprise Recruitment
            </div>
            <h2 className="section-heading" style={{ marginBottom: '1rem' }}>
              Eliminate Resume Noise With Explainable Matching
            </h2>
            <p className="body-text" style={{ marginBottom: '1.75rem' }}>
              Stop sorting through thousands of generic resumes. SkillNexus AI calculates candidate eligibility based on verified test outcomes, live coding challenges, and audited project repositories.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle2 size={18} style={{ color: '#7c3aed', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Explainable Match Scoring</div>
                  <div className="body-text" style={{ fontSize: '0.85rem' }}>Transparently see which skills matched (✓) and which criteria are missing (⚠) before shortlisting.</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle2 size={18} style={{ color: '#7c3aed', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Zero Unverified Claims</div>
                  <div className="body-text" style={{ fontSize: '0.85rem' }}>All listed candidate abilities are grounded in platform assessments and audited portfolio artifacts.</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle2 size={18} style={{ color: '#7c3aed', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Campus Talent Pipelines</div>
                  <div className="body-text" style={{ fontSize: '0.85rem' }}>Direct integration with affiliated colleges for internship-to-hire workflows.</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <Link to="/register?role=industry" className="btn btn-primary" style={{ background: '#7c3aed', borderColor: '#7c3aed' }}>
                Hire Skilled Talent <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Explainable Match Card Example */}
          <div className="card" style={{ border: '1.5px solid var(--border)', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <span className="status-badge-verified">
                  <ShieldCheck size={14} /> Verified Opportunity
                </span>
                <h3 className="card-heading" style={{ marginTop: '0.65rem' }}>AI Research Intern</h3>
                <div className="small-metadata">Apex Technologies • Remote • 6 Months</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>87%</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Skill Match</div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                WHY THIS CANDIDATE MATCHES:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
                <span className="match-chip-hit">✓ Python (85%)</span>
                <span className="match-chip-hit">✓ Machine Learning (82%)</span>
                <span className="match-chip-hit">✓ SQL (74%)</span>
              </div>

              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                SKILL GAPS TO CLOSE:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                <span className="match-chip-gap">⚠ TensorFlow (Developing)</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/opportunities" className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                View Opportunity
              </Link>
              <button className="btn btn-secondary btn-sm">
                Shortlist Candidate
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          6. ACADEMIA & FACULTY BENEFITS (Specification 7 #6)
          =================================================================== */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '3.5rem 1.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '3rem',
          alignItems: 'center'
        }}>
          {/* Left Visual Column */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem'
          }}>
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(5, 150, 105, 0.12)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Award size={20} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.35rem' }}>Faculty Training</div>
              <div className="body-text" style={{ fontSize: '0.85rem' }}>Direct corporate immersion programs to update classroom pedagogy.</div>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(5, 150, 105, 0.12)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Cpu size={20} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.35rem' }}>Joint R&D Grants</div>
              <div className="body-text" style={{ fontSize: '0.85rem' }}>Apply for sponsored industrial grants and shared intellectual property.</div>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(5, 150, 105, 0.12)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <BookOpen size={20} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.35rem' }}>Sponsored FDPs</div>
              <div className="body-text" style={{ fontSize: '0.85rem' }}>Faculty Development Programs sponsored by enterprise engineering leads.</div>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(5, 150, 105, 0.12)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Users size={20} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.35rem' }}>Guest Lectures</div>
              <div className="body-text" style={{ fontSize: '0.85rem' }}>Host industry practitioners directly into university lecture schedules.</div>
            </div>
          </div>

          {/* Right Text Column */}
          <div>
            <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              Empowering Faculty
            </div>
            <h2 className="section-heading" style={{ marginBottom: '1rem' }}>
              Bridge Pedagogy With Live Enterprise Practice
            </h2>
            <p className="body-text" style={{ marginBottom: '1.75rem' }}>
              Academicians are the cornerstone of sustainable talent pipelines. SkillNexus AI gives faculty members direct channels to engage in corporate consulting, lead student hackathons, and update teaching curricula to match industry pace.
            </p>

            <Link to="/register?role=academician" className="btn btn-primary" style={{ background: '#059669', borderColor: '#059669' }}>
              Connect with Industry Training <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===================================================================
          7. INSTITUTION ANALYTICS (Specification 7 #7)
          =================================================================== */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '3.5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#d97706', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            Institutional Governance
          </div>
          <h2 className="section-heading" style={{ marginBottom: '0.75rem' }}>
            Analytics-Driven Institutional Outcomes
          </h2>
          <p className="body-text" style={{ maxWidth: '640px', margin: '0 auto' }}>
            Replace anecdotal placement statistics with department-level skill readiness metrics, gap diagnosis heatmaps, and accreditation-ready reports.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div className="card-heading">Curriculum Skill Gaps</div>
              <BarChart3 size={20} style={{ color: '#d97706' }} />
            </div>
            <p className="body-text" style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Identify which technologies and subject areas show significant divergence from current corporate job descriptions.
            </p>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#d97706' }}>
              Department-Level Granularity
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div className="card-heading">Internship Conversion Index</div>
              <TrendingUp size={20} style={{ color: '#d97706' }} />
            </div>
            <p className="body-text" style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Monitor how many students transition from internship roles into full-time pre-placement offers (PPOs).
            </p>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#d97706' }}>
              Real-Time Tracking
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div className="card-heading">Accreditation Readiness</div>
              <FileCheck size={20} style={{ color: '#d97706' }} />
            </div>
            <p className="body-text" style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Export one-click reports structured for NAAC, NBA, and ABET compliance with verifiable student learning outcomes.
            </p>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#d97706' }}>
              Automated Audit Logs
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          8. AI CAPABILITIES (Specification 7 #8)
          =================================================================== */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '3.5rem 1.5rem' }}>
        <div style={{
          background: 'linear-gradient(145deg, #1e1b4b 0%, #0f172a 100%)',
          color: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          padding: '3.5rem 2.5rem',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.9rem',
              background: 'rgba(99, 102, 241, 0.25)',
              borderRadius: '9999px',
              fontSize: '0.825rem',
              fontWeight: 600,
              color: '#c7d2fe',
              marginBottom: '1rem'
            }}>
              <Sparkles size={16} /> Precision Artificial Intelligence
            </div>
            <h2 className="section-heading" style={{ color: '#ffffff', marginBottom: '0.75rem' }}>
              Intelligent Career Copilot Architecture
            </h2>
            <p style={{ color: '#cbd5e1', maxWidth: '640px', margin: '0 auto', fontSize: '1rem' }}>
              Our AI engine operates on authenticated student profiles and real-time industry taxonomies, ensuring every insight is grounded in reality.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.75rem'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.75rem'
            }}>
              <Bot size={28} style={{ color: '#818cf8', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff' }}>
                AI Career Guide
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Context-aware conversational copilot that accesses student assessment scores, analyzes gaps, and answers specific career strategy questions.
              </p>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.75rem'
            }}>
              <Target size={28} style={{ color: '#38bdf8', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff' }}>
                Skill Gap Engine
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Side-by-side gap diagnosis comparing student capabilities directly against benchmark company specifications.
              </p>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.75rem'
            }}>
              <Zap size={28} style={{ color: '#34d399', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff' }}>
                Mock Interview Simulator
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Interactive technical, behavioral, and HR interview simulation with real-time feedback on communication clarity and depth.
              </p>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.75rem'
            }}>
              <Award size={28} style={{ color: '#fbbf24', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff' }}>
                Explainable Match Scoring
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Percentage compatibility calculated with explicit matched requirements and clear warnings for missing competencies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          9. COLLABORATION ECOSYSTEM (Specification 7 #9)
          =================================================================== */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '3.5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            Multi-Disciplinary Hub
          </div>
          <h2 className="section-heading" style={{ marginBottom: '0.75rem' }}>
            Collaboration Ecosystem
          </h2>
          <p className="body-text" style={{ maxWidth: '640px', margin: '0 auto' }}>
            Nine distinct partnership modalities that connect academic research, student creativity, and enterprise innovation.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem'
        }}>
          {collaborationCategories.map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={i}
                className="card"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  transition: 'transform var(--transition-fast)'
                }}
              >
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--ai-accent-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    {c.name}
                  </div>
                  <div className="body-text" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    {c.summary}
                  </div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--primary)' }}>
                    {c.stats}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===================================================================
          10. TRUST & VERIFICATION STANDARDS (Specification 7 #10 & 31)
          =================================================================== */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '3.5rem 1.5rem' }}>
        <div className="card" style={{ padding: '2.5rem', border: '1px solid var(--border)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 className="section-heading" style={{ marginBottom: '0.5rem' }}>
              Transparent Verification Standards
            </h2>
            <p className="body-text" style={{ maxWidth: '600px', margin: '0 auto' }}>
              SkillNexus AI rejects misleading "100% Guaranteed" claims. Every posted opportunity and student profile undergoes verifiable risk classification.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem'
          }}>
            <div style={{ padding: '1.25rem', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.05)' }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <span className="status-badge-verified">
                  <ShieldCheck size={14} /> Verified Opportunity
                </span>
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.925rem', marginBottom: '0.35rem' }}>Audited Employer Identity</div>
              <div className="body-text" style={{ fontSize: '0.825rem' }}>
                Company registration, official corporate email, and accredited institutional sponsorship verified by system administrators.
              </div>
            </div>

            <div style={{ padding: '1.25rem', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 'var(--radius-md)', background: 'rgba(245, 158, 11, 0.05)' }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <span className="status-badge-review">
                  <ShieldAlert size={14} /> Review Recommended
                </span>
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.925rem', marginBottom: '0.35rem' }}>Secondary Review Required</div>
              <div className="body-text" style={{ fontSize: '0.825rem' }}>
                Recently submitted opportunities or new startups undergoing preliminary KYC credentialing. Candidates should exercise standard diligence.
              </div>
            </div>

            <div style={{ padding: '1.25rem', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', background: 'rgba(239, 68, 68, 0.05)' }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <span className="status-badge-risk">
                  <ShieldAlert size={14} /> High Risk / Blocked
                </span>
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.925rem', marginBottom: '0.35rem' }}>Flagged by Moderation</div>
              <div className="body-text" style={{ fontSize: '0.825rem' }}>
                Unverified external redirection links, suspicious recruiting criteria, or unresolved community reports are quarantined immediately.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          11. CALL TO ACTION (Specification 7 #11)
          =================================================================== */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '3.5rem 1.5rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--ai-accent) 100%)',
          color: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          padding: '4rem 2rem',
          textAlign: 'center',
          boxShadow: 'var(--shadow-primary)'
        }}>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, marginBottom: '1rem', color: '#fff' }}>
            Ready to Bridge the Gap Between Skills and Industry?
          </h2>
          <p style={{ maxWidth: '640px', margin: '0 auto 2.5rem', fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.9)' }}>
            Join thousands of students, university academicians, and corporate recruiters powering their career outcomes through SkillNexus AI.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/choose-journey" className="btn btn-secondary btn-lg" style={{ background: '#ffffff', color: 'var(--primary)', borderColor: '#ffffff' }}>
              Choose Your Journey <ArrowRight size={18} />
            </Link>
            <Link to="/register" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255, 255, 255, 0.6)', color: '#ffffff' }}>
              Sign Up Directly
            </Link>
          </div>
        </div>
      </section>

      {/* ===================================================================
          12. COMPREHENSIVE SAAS FOOTER (Specification 7 #12)
          =================================================================== */}
      <footer style={{
        maxWidth: '1280px',
        margin: '4rem auto 0',
        padding: '3rem 1.5rem 1rem',
        borderTop: '1px solid var(--border)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div className="brand-icon">
                <Layers size={18} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.25rem', fontFamily: 'var(--font-heading)' }}>
                SkillNexus AI
              </span>
            </div>
            <p className="body-text" style={{ fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              Bridge Your Skills to Your Future. The unified talent and collaboration ecosystem connecting students, academia, and industry.
            </p>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Enterprise Grade RBAC • SOC-2 Type II Compliant
            </div>
          </div>

          {/* Stakeholder Portals */}
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Stakeholder Portals
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <Link to="/register?role=student" style={{ color: 'var(--text-secondary)' }}>Student Portal</Link>
              <Link to="/register?role=industry" style={{ color: 'var(--text-secondary)' }}>Industry Recruiting</Link>
              <Link to="/register?role=academician" style={{ color: 'var(--text-secondary)' }}>Academician FDPs</Link>
              <Link to="/register?role=institution" style={{ color: 'var(--text-secondary)' }}>Institution Analytics</Link>
              <Link to="/choose-journey" style={{ color: 'var(--primary)', fontWeight: 600 }}>Choose Your Journey →</Link>
            </div>
          </div>

          {/* AI Features */}
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              AI Capabilities
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <Link to="/student/skills" style={{ color: 'var(--text-secondary)' }}>AI Skill Mapping</Link>
              <Link to="/student/skill-gap" style={{ color: 'var(--text-secondary)' }}>Skill Gap Diagnosis</Link>
              <Link to="/student/ai-prep" style={{ color: 'var(--text-secondary)' }}>Mock Interview Simulator</Link>
              <Link to="/opportunities" style={{ color: 'var(--text-secondary)' }}>Explainable Match Scoring</Link>
            </div>
          </div>

          {/* Ecosystem & Trust */}
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Ecosystem & Trust
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <Link to="/opportunities" style={{ color: 'var(--text-secondary)' }}>Live Opportunities</Link>
              <Link to="/academician/collaborations" style={{ color: 'var(--text-secondary)' }}>Collaboration Hub</Link>
              <a href="#verification" style={{ color: 'var(--text-secondary)' }}>Verification Standards</a>
              <Link to="/login" style={{ color: 'var(--text-secondary)' }}>Account Sign In</Link>
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--border)',
          fontSize: '0.825rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            © {new Date().getFullYear()} SkillNexus AI Platform. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security Statement</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

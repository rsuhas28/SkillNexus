import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../services/api.js';
import {
  Award,
  GraduationCap,
  Briefcase,
  ExternalLink,
  Github,
  Linkedin,
  MapPin,
  CheckCircle,
  FileText
} from 'lucide-react';

export const PublicPortfolioPage = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPortfolio();
  }, [slug]);

  const loadPortfolio = async () => {
    setLoading(true);
    try {
      const res = await api.getPublicPortfolio(slug);
      setData(res.data);
    } catch (err) {
      setError(err.message || 'Portfolio not found or currently set to private.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        Loading student portfolio...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
        <div className="card" style={{ maxWidth: '500px', padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>Portfolio Not Available</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            {error || 'The requested portfolio is either private or does not exist.'}
          </p>
          <a href="/" className="btn btn-primary">Return to SkillNexus</a>
        </div>
      </div>
    );
  }

  const { profile, skills, education, projects, certifications, achievements, portfolio } = data;
  const visibleSections = (portfolio.sections || []).filter(s => s.visible).map(s => s.type);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-main)', padding: '3rem 1rem' }}>
      <div style={{ maxWidth: '950px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* Hero Header */}
        <div className="card" style={{
          padding: '2.5rem',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(59,130,246,0.06) 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#fff',
            marginBottom: '1rem',
            boxShadow: '0 8px 24px rgba(59,130,246,0.3)'
          }}>
            {profile.photo ? (
              <img src={profile.photo} alt={profile.fullName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              (profile.fullName || 'S')[0].toUpperCase()
            )}
          </div>

          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.3rem' }}>{profile.fullName || 'SkillNexus Candidate'}</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: 500, marginBottom: '0.6rem' }}>
            {profile.headline || `${profile.department || 'Computer Science'} Student`}
          </p>

          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            {profile.institution && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <GraduationCap size={16} /> {profile.institution}
              </span>
            )}
            {profile.location && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <MapPin size={16} /> {profile.location}
              </span>
            )}
          </div>

          {/* Social Links */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {profile.github && (
              <a href={profile.github} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Github size={15} /> GitHub
              </a>
            )}
            {profile.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Linkedin size={15} /> LinkedIn
              </a>
            )}
          </div>
        </div>

        {/* About Section */}
        {visibleSections.includes('about') && profile.about && (
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>About Me</h2>
            <p style={{ lineHeight: 1.7, color: 'var(--text-muted)', whiteSpace: 'pre-line' }}>{profile.about}</p>
          </div>
        )}

        {/* Skills Section */}
        {visibleSections.includes('skills') && skills?.length > 0 && (
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award className="text-primary" size={22} /> Technical & Professional Skills
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              {skills.map(s => (
                <span
                  key={s._id}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {s.skillName}
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.08)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                    {s.proficiency}
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {visibleSections.includes('projects') && projects?.length > 0 && (
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Briefcase className="text-primary" size={22} /> Featured Projects
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.25rem' }}>
              {projects.map(p => (
                <div key={p._id} style={{ padding: '1.25rem', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.5rem' }}>{p.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                      {p.description}
                    </p>
                    {p.technologies?.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                        {p.technologies.map((t, idx) => (
                          <span key={idx} style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', borderRadius: '4px' }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Github size={14} /> Repository
                      </a>
                    )}
                    {p.demoUrl && (
                      <a href={p.demoUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <ExternalLink size={14} /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {visibleSections.includes('education') && education?.length > 0 && (
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GraduationCap className="text-primary" size={22} /> Education History
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {education.map(e => (
                <div key={e._id} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{e.degree} {e.specialization ? `in ${e.specialization}` : ''}</h3>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{e.institution}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{e.startYear} - {e.endYear}</div>
                    {e.cgpa && <div style={{ color: '#10b981', fontSize: '0.85rem' }}>CGPA: {e.cgpa}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

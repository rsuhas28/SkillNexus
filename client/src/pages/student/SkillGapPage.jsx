import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { Target, Sparkles, BookOpen, AlertTriangle, CheckCircle, ArrowRight, ExternalLink } from 'lucide-react';

export const SkillGapPage = () => {
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [customRole, setCustomRole] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [learningRecs, setLearningRecs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingRecs, setLoadingRecs] = useState(false);

  const presetRoles = [
    'Full Stack Developer',
    'Frontend Engineer',
    'Backend Engineer',
    'AI / Machine Learning Engineer',
    'Data Scientist',
    'Cloud / DevOps Engineer',
    'Cybersecurity Analyst'
  ];

  useEffect(() => {
    loadLatestGap();
  }, []);

  const loadLatestGap = async () => {
    try {
      const res = await api.getLatestSkillGap();
      if (res.data) {
        setAnalysis(res.data);
        fetchLearning(res.data.missingSkills || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnalyze = async (roleToAnalyze) => {
    const role = roleToAnalyze || customRole || targetRole;
    if (!role) return;

    setLoading(true);
    try {
      const res = await api.computeSkillGap({ targetRole: role });
      setAnalysis(res.data);
      fetchLearning(res.data.missingSkills || []);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLearning = async (gaps) => {
    if (!gaps || gaps.length === 0) return;
    setLoadingRecs(true);
    try {
      const res = await api.getLearningRecommendations({ skillGaps: gaps });
      setLearningRecs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRecs(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1050px' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Target className="text-primary" size={28} />
          AI Skill-Gap & Career Readiness Analyzer
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Evaluate your current skill profile against industry role benchmarks and receive targeted curriculum recommendations.
        </p>
      </div>

      {/* Role Selector Card */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1rem' }}>Select Target Career Role</h2>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {presetRoles.map(role => (
            <button
              key={role}
              onClick={() => { setTargetRole(role); setCustomRole(''); handleAnalyze(role); }}
              className={`btn btn-sm ${targetRole === role && !customRole ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: '20px', padding: '0.35rem 0.9rem' }}
            >
              {role}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Or type a custom role (e.g. Site Reliability Engineer)"
            value={customRole}
            onChange={e => setCustomRole(e.target.value)}
            className="form-input"
            style={{ flex: 1 }}
          />
          <button
            onClick={() => handleAnalyze(customRole)}
            disabled={loading || (!customRole && !targetRole)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}
          >
            <Sparkles size={16} /> {loading ? 'Analyzing...' : 'Analyze Gaps'}
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Readiness Score Card */}
          <div className="card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                Benchmark Analysis
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                {analysis.targetRole}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Based on current industry opportunity listings and skill ontology benchmarks.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: analysis.readinessScore >= 70 ? '#10b981' : analysis.readinessScore >= 40 ? '#f59e0b' : '#ef4444' }}>
                  {analysis.readinessScore}%
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Role Match Readiness</div>
              </div>
            </div>
          </div>

          {/* Skills Comparison */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {/* Acquired Skills */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
                <CheckCircle size={18} /> Matched / Current Skills
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {analysis.currentSkills?.map((s, idx) => (
                  <span key={idx} style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', background: 'rgba(16,185,129,0.1)', color: '#10b981', fontSize: '0.85rem' }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
                <AlertTriangle size={18} /> Identified Skill Gaps
              </h3>
              {analysis.missingSkills?.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No major skill gaps identified for this role!</p>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {analysis.missingSkills?.map((s, idx) => (
                    <span key={idx} style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontSize: '0.85rem' }}>
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* AI Recommended Learning Resources (Req 31) */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <BookOpen className="text-primary" size={20} /> AI Curated Learning Recommendations
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Structured courses, interactive tutorials, and documentation specifically mapped to bridge your gaps.
            </p>

            {loadingRecs ? (
              <div style={{ color: 'var(--text-muted)', padding: '1.5rem', textAlign: 'center' }}>Generating curriculum recommendations...</div>
            ) : learningRecs?.recommendations?.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {learningRecs.recommendations.map((rec, i) => (
                  <div key={i} style={{ padding: '1.2rem', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#fff', marginBottom: '0.75rem' }}>
                      Skill: {rec.skill}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {rec.resources?.map((res, rIdx) => (
                        <div key={rIdx} style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          • <strong style={{ color: 'var(--primary)' }}>{res.title}</strong>
                          {res.provider && <span> ({res.provider})</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                All required baseline skills are accounted for in your profile.
              </p>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

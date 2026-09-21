import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api.js';
import { CheckCircle, XCircle, Award, ArrowRight, Lightbulb, TrendingUp, BarChart2 } from 'lucide-react';

export const AssessmentResultsPage = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResult();
  }, [attemptId]);

  const loadResult = async () => {
    setLoading(true);
    try {
      const res = await api.getAttemptResults(attemptId);
      setResult(res.data);
    } catch (err) {
      alert(err.message);
      navigate('/student/assessments');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading assessment diagnostics...</div>;
  }

  const { title, score, totalQuestions, percentage, passed, classification, suggestions } = result;

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '850px' }}>
      {/* Header Result Card */}
      <div className="card" style={{
        padding: '2.5rem',
        textAlign: 'center',
        background: passed
          ? 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(255,255,255,0.02) 100%)'
          : 'linear-gradient(135deg, rgba(239,68,68,0.08) 0%, rgba(255,255,255,0.02) 100%)',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: passed ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
          color: passed ? '#10b981' : '#ef4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem'
        }}>
          {passed ? <CheckCircle size={38} /> : <XCircle size={38} />}
        </div>

        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.4rem' }}>
          {passed ? 'Assessment Successfully Cleared!' : 'Assessment Incomplete'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '1.5rem' }}>{title}</p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: passed ? '#10b981' : '#ef4444' }}>
              {percentage}%
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Score Percentage</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>
              {score} / {totalQuestions}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Questions Correct</div>
          </div>
        </div>

        {passed && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 1rem', borderRadius: '20px', background: 'rgba(16,185,129,0.15)', color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}>
            <Award size={16} /> Verified Competency Badge Added to Profile
          </div>
        )}
      </div>

      {/* Topic Breakdown Card */}
      {classification && (
        <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp className="text-primary" size={20} /> Topic-wise Diagnostic Breakdown
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Strong */}
            {classification.strong?.length > 0 && (
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#10b981', marginBottom: '0.5rem' }}>
                  STRONG AREAS (≥ 75%)
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {classification.strong.map((t, idx) => (
                    <span key={idx} style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', background: 'rgba(16,185,129,0.1)', color: '#10b981', fontSize: '0.85rem', fontWeight: 500 }}>
                      {t.topic}: {t.score}%
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Moderate */}
            {classification.moderate?.length > 0 && (
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f59e0b', marginBottom: '0.5rem' }}>
                  MODERATE AREAS (40% - 74%)
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {classification.moderate.map((t, idx) => (
                    <span key={idx} style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 500 }}>
                      {t.topic}: {t.score}%
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Weak */}
            {classification.weak?.length > 0 && (
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ef4444', marginBottom: '0.5rem' }}>
                  NEEDS FOCUS (&lt; 40%)
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {classification.weak.map((t, idx) => (
                    <span key={idx} style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontSize: '0.85rem', fontWeight: 500 }}>
                      {t.topic}: {t.score}%
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Suggested Action Items */}
      {suggestions && Object.keys(suggestions).length > 0 && (
        <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lightbulb className="text-primary" size={20} /> Targeted Improvement Suggestions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {Object.entries(suggestions).map(([topic, note], idx) => (
              <div key={idx} style={{ padding: '0.9rem', borderRadius: '6px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', fontSize: '0.9rem' }}>
                <strong style={{ color: '#fff' }}>{topic}: </strong>
                <span style={{ color: 'var(--text-muted)' }}>{note}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
        <button onClick={() => navigate('/student/assessments')} className="btn btn-secondary">
          Back to Assessments
        </button>
        <button onClick={() => navigate('/student/skill-gap')} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          Analyze Career Skill Gaps <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

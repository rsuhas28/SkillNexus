import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api.js';
import { BookOpenCheck, Clock, CheckCircle, AlertCircle, ArrowRight, History, Award } from 'lucide-react';

export const AssessmentsPage = () => {
  const [assessments, setAssessments] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available'); // 'available' | 'history'
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [listRes, myAttemptsRes] = await Promise.all([
        api.getAssessments(),
        api.getMyAttempts()
      ]);
      setAssessments(listRes.data || []);
      setAttempts(myAttemptsRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1050px' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <BookOpenCheck className="text-primary" size={28} />
          SkillNexus Assessments & Certifications
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Take standardized technical, soft-skill, and aptitude assessments to earn verified skill badges on your profile.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setActiveTab('available')}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'available' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'available' ? '#fff' : 'var(--text-muted)',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Available Exams ({assessments.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'history' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'history' ? '#fff' : 'var(--text-muted)',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <History size={16} /> Exam History ({attempts.length})
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading tests...</div>
      ) : activeTab === 'available' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {assessments.map(exam => {
            const pastAttempt = attempts.find(a => a.assessmentId === exam.id && a.status === 'completed');
            return (
              <div key={exam.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <span className="badge badge-primary" style={{ textTransform: 'capitalize', fontSize: '0.75rem' }}>
                      {exam.type}
                    </span>
                    {pastAttempt && (
                      <span className={`badge ${pastAttempt.passed ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.7rem' }}>
                        {pastAttempt.passed ? 'Passed' : 'Not Cleared'} ({pastAttempt.percentage}%)
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>{exam.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                    {exam.description}
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={15} /> {exam.timeLimit} Mins
                    </span>
                    <span>• {exam.totalQuestions} Questions</span>
                    <span>• Pass: {exam.passPercentage}%</span>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {pastAttempt ? (
                    <button
                      onClick={() => navigate(`/student/assessments/results/${pastAttempt._id}`)}
                      className="btn btn-sm btn-secondary"
                    >
                      View Last Score
                    </button>
                  ) : <div />}

                  <button
                    onClick={() => navigate(`/student/assessments/take/${exam.id}`)}
                    className="btn btn-sm btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    {pastAttempt ? 'Retake Exam' : 'Start Exam'} <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Exam History */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {attempts.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <History size={40} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
              <h3>No assessment history yet</h3>
              <p style={{ color: 'var(--text-muted)' }}>Complete your first assessment to unlock verified badges.</p>
            </div>
          ) : (
            attempts.map(att => (
              <div key={att._id} className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{att.title}</h3>
                    <span className={`badge ${att.passed ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.7rem' }}>
                      {att.passed ? 'PASSED' : 'FAILED'}
                    </span>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Completed on {new Date(att.completedAt || att.createdAt).toLocaleDateString()} • Type: {att.type}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: 700, color: att.passed ? '#10b981' : '#ef4444' }}>
                      {att.percentage}%
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {att.score} / {att.totalQuestions} Correct
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/student/assessments/results/${att._id}`)}
                    className="btn btn-sm btn-secondary"
                  >
                    View Analysis
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

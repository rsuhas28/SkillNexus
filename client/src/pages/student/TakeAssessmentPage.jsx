import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api.js';
import { Clock, AlertCircle, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

export const TakeAssessmentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    startExam();
  }, [id]);

  const startExam = async () => {
    setLoading(true);
    try {
      const res = await api.startAssessment(id);
      setSession(res.data);
      setTimeLeft(res.data.timeLimit * 60);
    } catch (err) {
      alert(err.message);
      navigate('/student/assessments');
    } finally {
      setLoading(false);
    }
  };

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0 || !session) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, session]);

  const handleSelectOption = (questionId, optionIndex) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const handleSubmit = async (auto = false) => {
    if (!auto && !window.confirm('Are you ready to submit your assessment?')) return;
    setSubmitting(true);
    try {
      const res = await api.submitAssessment(session.attemptId, { answers });
      navigate(`/student/assessments/results/${session.attemptId}`);
    } catch (err) {
      alert(err.message);
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Preparing examination environment...</div>;
  }

  const currentQ = session.questions[currentIndex];
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '850px' }}>
      {/* Exam Header bar */}
      <div className="card" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', position: 'sticky', top: '70px', zIndex: 10 }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{session.title}</h2>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Question {currentIndex + 1} of {session.questions.length} • {session.type}
          </div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 0.9rem',
          borderRadius: '20px',
          background: timeLeft < 300 ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.15)',
          color: timeLeft < 300 ? '#ef4444' : '#3b82f6',
          fontWeight: 700
        }}>
          <Clock size={16} />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          Topic: {currentQ.topic}
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.6, marginBottom: '1.5rem' }}>
          {currentQ.text}
        </h3>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {currentQ.options.map((option, idx) => {
            const isSelected = answers[currentQ.id] === idx;
            return (
              <div
                key={idx}
                onClick={() => handleSelectOption(currentQ.id, idx)}
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '8px',
                  background: isSelected ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.02)',
                  border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.9rem',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: isSelected ? '6px solid var(--primary)' : '2px solid var(--border-subtle)',
                  background: isSelected ? '#fff' : 'transparent'
                }} />
                <span style={{ fontSize: '0.95rem', color: isSelected ? '#fff' : 'var(--text-muted)' }}>
                  {option}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <ArrowLeft size={16} /> Previous
        </button>

        {currentIndex < session.questions.length - 1 ? (
          <button
            onClick={() => setCurrentIndex(prev => prev + 1)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            Next <ArrowRight size={16} />
          </button>
        ) : (
          <button
            onClick={() => handleSubmit(false)}
            disabled={submitting}
            className="btn btn-primary"
            style={{ background: '#10b981', borderColor: '#10b981', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <CheckCircle size={16} /> {submitting ? 'Submitting...' : 'Finish & Submit Exam'}
          </button>
        )}
      </div>

      {/* Question Selector Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginTop: '2rem', flexWrap: 'wrap' }}>
        {session.questions.map((q, idx) => {
          const isAnswered = answers[q.id] !== undefined;
          const isCurrent = idx === currentIndex;
          return (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                border: isCurrent ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                background: isAnswered ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.04)',
                color: isAnswered ? '#10b981' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

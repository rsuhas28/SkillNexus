import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import {
  Sparkles,
  MessageSquare,
  Mic,
  MicOff,
  CheckCircle2,
  Calendar,
  Send,
  RefreshCw,
  Award,
  BookOpen,
  CheckSquare,
  Square,
  HelpCircle,
  ExternalLink,
  Flame,
  ChevronRight
} from 'lucide-react';

export const AIPrepPage = () => {
  const [activeTab, setActiveTab] = useState('mock'); // 'mock' | 'checklist' | 'plan'
  const [role, setRole] = useState('Full Stack Developer');

  // Mock Interview State
  const [sessionId, setSessionId] = useState(null);
  const [questionData, setQuestionData] = useState(null);
  const [answer, setAnswer] = useState('');
  const [evalResult, setEvalResult] = useState(null);
  const [finalFeedback, setFinalFeedback] = useState(null);
  const [interviewHistory, setInterviewHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Prep Checklist & Plan States
  const [prepChecklist, setPrepChecklist] = useState(null);
  const [prepPlan, setPrepPlan] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [completedChecklist, setCompletedChecklist] = useState({});
  const [completedTasks, setCompletedTasks] = useState({});

  // Web Speech API initialization (Req 67)
  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. You can type your answers directly.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = (e) => {
      console.error(e);
      setIsRecording(false);
    };
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setAnswer(prev => prev ? `${prev} ${transcript}` : transcript);
    };

    recognition.start();
  };

  const handleStartMock = async () => {
    setLoading(true);
    setFinalFeedback(null);
    setInterviewHistory([]);
    try {
      const res = await api.startMockInterview({ role });
      setSessionId(res.data.sessionId);
      setQuestionData({
        question: res.data.question,
        type: res.data.type,
        index: res.data.questionIndex
      });
      setEvalResult(null);
      setAnswer('');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim() || !sessionId) return;

    setLoading(true);
    try {
      const res = await api.answerMockInterview({ sessionId, answer });
      const { evaluation, isCompleted, nextQuestion, finalFeedback } = res.data;

      setEvalResult(evaluation);
      setInterviewHistory(prev => [
        ...prev,
        {
          question: questionData.question,
          answer,
          evaluation
        }
      ]);

      if (isCompleted) {
        setFinalFeedback(finalFeedback);
        setQuestionData(null);
      } else if (nextQuestion) {
        setQuestionData({
          question: nextQuestion.question,
          type: nextQuestion.type,
          index: nextQuestion.questionIndex
        });
      }
      setAnswer('');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadPrepChecklist = async () => {
    setLoadingPlan(true);
    try {
      const res = await api.getInterviewPrep({ role });
      if (res?.data && res.data.technicalTopics?.length > 0) {
        setPrepChecklist(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPlan(false);
    }
  };

  const loadPrepPlan = async () => {
    setLoadingPlan(true);
    try {
      const res = await api.getPrepPlan({ targetRole: role, timeline: 4 });
      if (res?.data && res.data.weeks?.length > 0) {
        setPrepPlan(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPlan(false);
    }
  };

  const toggleChecklistItem = (idx) => {
    setCompletedChecklist(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const togglePlanTask = (weekIdx, taskIdx) => {
    const key = `${weekIdx}_${taskIdx}`;
    setCompletedTasks(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Fallback defaults in case network or backend returns placeholder
  const activeChecklist = prepChecklist || {
    role,
    technicalTopics: [
      'Modern JavaScript (ES6+): Closures, Async/Await & Event Loop',
      'React 19 Architecture: Hooks, Server Components & Virtual DOM',
      'Scalable Backend Design: REST APIs, Middleware & Rate Limiting',
      'Database Internals: Indexing, ACID Transactions & MongoDB Pipelines',
      'Web Security: OWASP Top 10, JWT Authentication, OAuth2 & CORS',
      'System Design: Microservices, Distributed Caching & Load Balancing'
    ],
    behavioralTopics: [
      'STAR Method: Situation, Task, Action, Result for Tech Challenges',
      'Cross-Functional Collaboration with Designers & Product Managers',
      'Navigating Technical Debt vs. Feature Delivery Deadlines',
      'Incident Triage and Blameless Post-Mortems'
    ],
    preparationChecklist: [
      'Solve 20 curated LeetCode Medium challenges (Arrays, Two Pointers, Trees, DP)',
      'Build a production-ready authentication flow with JWT refresh tokens & RBAC',
      'Design a scalable distributed architecture (e.g. Real-Time Chat or URL Shortener)',
      'Prepare 4 structured STAR-method stories illustrating problem-solving under pressure',
      'Conduct 3 timed mock interview sessions with the SkillNexus AI Interview Simulator',
      'Audit your GitHub portfolio and deploy capstone with automated CI/CD pipelines'
    ],
    likelyQuestions: [
      {
        question: 'How does Node.js handle concurrent I/O operations despite being single-threaded?',
        type: 'Backend Architecture',
        framework: 'Detail the libuv event loop phases, non-blocking I/O polling, and worker threads for CPU-bound tasks.'
      },
      {
        question: 'How would you design a real-time notification system serving 1M daily active users?',
        type: 'System Design',
        framework: 'Cover WebSockets vs Server-Sent Events, Redis Pub/Sub distributed broker, and graceful reconnection.'
      },
      {
        question: 'Explain how React\'s Virtual DOM and Reconciliation algorithm operate.',
        type: 'Frontend Architecture',
        framework: 'Explain diffing heuristics (O(n)), key prop significance, Fiber double-buffering, and the React 19 compiler.'
      },
      {
        question: 'Tell me about a time when a production release broke. How did you triage and resolve it?',
        type: 'Behavioral / STAR',
        framework: 'Use STAR: describe the critical bug (Situation), your task, immediate rollback/hotfix (Action), and post-mortem improvements (Result).'
      }
    ]
  };

  const activePlan = (prepPlan?.weeks && prepPlan.weeks.length > 0 && !prepPlan.weeks[0].focus.includes('Configure AI')) ? prepPlan : {
    targetRole: role,
    weeks: [
      {
        week: 1,
        focus: 'DSA Foundations, Algorithm Patterns & Computational Complexity',
        tasks: [
          'Master HashMaps, Two-Pointer technique, and Sliding Window patterns',
          'Solve 15 curated LeetCode Easy & Medium problems (Arrays, Strings, Linked Lists)',
          'Deep dive into Big-O time and space complexity trade-offs with practical benchmarks',
          'Review Clean Code guidelines, SOLID principles, and common design patterns'
        ],
        resources: [
          'NeetCode 150 Algorithms Roadmap',
          'Eloquent JavaScript & Clean Code Architecture',
          'LeetCode Curated 75 Problem Set'
        ]
      },
      {
        week: 2,
        focus: 'Scalable Backend APIs, Database Internals & Secure Authentication',
        tasks: [
          'Design production-grade REST APIs adhering to OpenAPI 3.0 specification guidelines',
          'Optimize SQL queries and MongoDB Aggregation Pipelines with Compound Indexes',
          'Implement secure OAuth2 / JWT authentication with token rotation & role guards',
          'Build and benchmark a Redis-backed rate limiter and distributed caching layer'
        ],
        resources: [
          'Designing Data-Intensive Applications by Martin Kleppmann',
          'Node.js Security Best Practices (OWASP)',
          'MongoDB Indexing Strategies & ESR Rule'
        ]
      },
      {
        week: 3,
        focus: 'Modern Frontend Engineering, State Synchronization & Web Performance',
        tasks: [
          'Build responsive, accessible user interfaces compliant with WCAG 2.1 AA standards',
          'Master React state management patterns (Context API, custom hooks, memoization)',
          'Optimize Core Web Vitals (LCP, FID/INP, CLS) using lazy loading and code-splitting',
          'Write comprehensive unit and integration tests using Vitest and React Testing Library'
        ],
        resources: [
          'React Official Documentation & Advanced Guides',
          'Web.dev Core Web Vitals Optimization',
          'Testing JavaScript Applications Handbook'
        ]
      },
      {
        week: 4,
        focus: 'Distributed System Design, Mock Interviews & Live Capstone Showcase',
        tasks: [
          'Architect end-to-end distributed systems (URL shortener, Real-time chat with WebSockets)',
          'Practice 5 timed mock interview sessions on the SkillNexus AI Simulator',
          'Prepare 4 structured STAR-method behavioral stories for engineering leadership interviews',
          'Deploy full-stack capstone application to cloud with automated GitHub Actions CI/CD'
        ],
        resources: [
          'System Design Primer (GitHub / Donne Martin)',
          'Grokking Modern System Design',
          'SkillNexus AI Voice Interview Simulator'
        ]
      }
    ]
  };

  const checklistCompletedCount = Object.values(completedChecklist).filter(Boolean).length;
  const checklistTotalCount = activeChecklist.preparationChecklist?.length || 0;

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1050px' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Sparkles className="text-primary" size={28} />
          AI Interview Preparation & Mock Simulator
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Practice multi-turn mock interviews with voice input, review structured interview checklists, and follow a 4-week study blueprint.
        </p>
      </div>

      {/* Role Selection bar */}
      <div className="card" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Target Role:</span>
        <input
          type="text"
          value={role}
          onChange={e => setRole(e.target.value)}
          className="form-input"
          style={{ maxWidth: '300px' }}
        />
        <button
          onClick={() => {
            if (activeTab === 'checklist') loadPrepChecklist();
            if (activeTab === 'plan') loadPrepPlan();
          }}
          className="btn btn-secondary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <RefreshCw size={14} /> Update Role
        </button>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>AI tailors questions, checklists, and study blueprints to this target role.</span>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setActiveTab('mock')}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'mock' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'mock' ? '#fff' : 'var(--text-muted)',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <MessageSquare size={16} /> Interactive Mock Interview
        </button>
        <button
          onClick={() => { setActiveTab('checklist'); loadPrepChecklist(); }}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'checklist' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'checklist' ? '#fff' : 'var(--text-muted)',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <CheckCircle2 size={16} /> Interview Prep Checklist
        </button>
        <button
          onClick={() => { setActiveTab('plan'); loadPrepPlan(); }}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'plan' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'plan' ? '#fff' : 'var(--text-muted)',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Calendar size={16} /> 4-Week Study Plan
        </button>
      </div>

      {/* Tab 1: Mock Interview */}
      {activeTab === 'mock' && (
        <div>
          {!sessionId && !finalFeedback && (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
              <Sparkles size={48} className="text-primary" style={{ margin: '0 auto 1rem' }} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Ready for your mock interview?</h2>
              <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
                The AI interviewer will ask 5 tailored technical, situational, and behavioral questions for the role of <strong>{role}</strong>.
              </p>
              <button onClick={handleStartMock} disabled={loading} className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
                {loading ? 'Initializing...' : 'Begin Mock Interview Session'}
              </button>
            </div>
          )}

          {/* Active Question */}
          {questionData && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="card" style={{ padding: '2rem', borderLeft: '4px solid var(--primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>Question {(questionData.index || 0) + 1} of 5</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{questionData.type}</span>
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 600, lineHeight: 1.5 }}>
                  {questionData.question}
                </h3>
              </div>

              {/* Answer Input */}
              <form onSubmit={handleAnswerSubmit} className="card" style={{ padding: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Your Answer:
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type your structured response or click the microphone to speak..."
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  className="form-input"
                  style={{ marginBottom: '1rem' }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={startSpeechRecognition}
                    className={`btn btn-sm ${isRecording ? 'btn-danger' : 'btn-secondary'}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    {isRecording ? <MicOff size={15} /> : <Mic size={15} />}
                    {isRecording ? 'Listening...' : 'Voice Input (Req 67)'}
                  </button>

                  <button
                    type="submit"
                    disabled={loading || !answer.trim()}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <Send size={15} /> {loading ? 'Evaluating...' : 'Submit Answer'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Feedback from previous answer */}
          {evalResult && !finalFeedback && (
            <div className="card" style={{ padding: '1.5rem', marginTop: '1.5rem', background: 'rgba(59,130,246,0.03)' }}>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--primary)', marginBottom: '0.4rem' }}>
                AI Evaluator Feedback:
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                {evalResult.feedback}
              </p>
              {evalResult.score !== null && (
                <div style={{ fontSize: '0.85rem' }}>
                  Rating: <strong style={{ color: '#10b981' }}>{evalResult.score} / 10</strong>
                </div>
              )}
            </div>
          )}

          {/* Final Feedback Report */}
          {finalFeedback && (
            <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16,185,129,0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <CheckCircle2 size={32} />
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.5rem' }}>Mock Interview Completed!</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{finalFeedback.summary}</p>

              {finalFeedback.overallScore && (
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#10b981', marginBottom: '1.5rem' }}>
                  {finalFeedback.overallScore} / 10
                </div>
              )}

              <button onClick={handleStartMock} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <RefreshCw size={16} /> Start Another Session
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Checklist */}
      {activeTab === 'checklist' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Actionable Checklist Card */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckSquare size={20} style={{ color: '#10b981' }} />
                  Actionable Interview Readiness Checklist
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                  Track your preparation milestones for <strong>{role}</strong>:
                </p>
              </div>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.35rem 0.75rem', borderRadius: '9999px', fontSize: '0.82rem', fontWeight: 600, color: '#10b981' }}>
                {checklistCompletedCount} of {checklistTotalCount} Completed
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {activeChecklist.preparationChecklist?.map((item, idx) => {
                const isChecked = !!completedChecklist[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleChecklistItem(idx)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.8rem 1rem',
                      borderRadius: '8px',
                      background: isChecked ? 'rgba(16, 185, 129, 0.06)' : 'rgba(255,255,255,0.02)',
                      border: isChecked ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {isChecked ? (
                      <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0 }} />
                    ) : (
                      <Square size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    )}
                    <span style={{
                      fontSize: '0.9rem',
                      color: isChecked ? '#e2e8f0' : 'var(--text)',
                      textDecoration: isChecked ? 'line-through' : 'none',
                      opacity: isChecked ? 0.8 : 1
                    }}>
                      {item}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key Technical Topics */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Flame size={18} style={{ color: '#f59e0b' }} />
              Key Technical Focus Topics
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              High-frequency concepts covered in technical screens:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              {activeChecklist.technicalTopics?.map((t, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '0.5rem 0.9rem',
                    borderRadius: '8px',
                    background: 'rgba(59, 130, 246, 0.08)',
                    border: '1px solid rgba(59, 130, 246, 0.25)',
                    color: '#93c5fd',
                    fontSize: '0.88rem',
                    fontWeight: 500
                  }}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Behavioral Competencies */}
          {activeChecklist.behavioralTopics?.length > 0 && (
            <div className="card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={18} style={{ color: '#a855f7' }} />
                Behavioral & Leadership Principles
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                Core evaluation criteria for culture-fit and collaboration:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                {activeChecklist.behavioralTopics.map((b, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '0.5rem 0.9rem',
                      borderRadius: '8px',
                      background: 'rgba(168, 85, 247, 0.08)',
                      border: '1px solid rgba(168, 85, 247, 0.25)',
                      color: '#d8b4fe',
                      fontSize: '0.88rem',
                      fontWeight: 500
                    }}
                  >
                    {b}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Likely Questions */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HelpCircle size={18} style={{ color: '#3b82f6' }} />
              Likely Interview Questions & Recommended Approaches
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Curated questions with suggested mental models and architectural frameworks:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {activeChecklist.likelyQuestions?.map((q, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '1.2rem',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{ fontWeight: 600, fontSize: '1rem', color: '#f8fafc' }}>
                      Q{idx + 1}: {q.question}
                    </div>
                    <span className="badge badge-primary" style={{ fontSize: '0.72rem', flexShrink: 0 }}>
                      {q.type}
                    </span>
                  </div>
                  {q.framework && (
                    <div style={{
                      marginTop: '0.6rem',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      background: 'rgba(59, 130, 246, 0.05)',
                      borderLeft: '3px solid #3b82f6',
                      fontSize: '0.85rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.5
                    }}>
                      <strong style={{ color: '#60a5fa' }}>Recommended Framework / Approach: </strong>
                      {q.framework}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Plan */}
      {activeTab === 'plan' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Header Banner */}
          <div className="card" style={{ padding: '1.75rem', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(99, 102, 241, 0.04))', borderColor: 'rgba(59, 130, 246, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="badge badge-primary" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>Structured 4-Week Blueprint</span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>4-Week Mastery Study Plan for {role}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.25rem' }}>
                  Progressive milestone-driven roadmap designed to take you from core fundamentals to interview-ready.
                </p>
              </div>
              <button
                onClick={loadPrepPlan}
                className="btn btn-secondary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <RefreshCw size={14} /> Refresh Plan
              </button>
            </div>
          </div>

          {/* Weekly Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {activePlan.weeks.map((week, wIdx) => (
              <div key={wIdx} className="card" style={{ padding: '1.75rem', borderLeft: '4px solid #6366f1' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ background: '#4f46e5', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700 }}>
                      WEEK {week.week}
                    </span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
                      {week.focus}
                    </h3>
                  </div>
                </div>

                {/* Tasks */}
                <div style={{ marginTop: '0.75rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                    Weekly Milestone Tasks:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {week.tasks?.map((task, tIdx) => {
                      const key = `${wIdx}_${tIdx}`;
                      const isChecked = !!completedTasks[key];
                      return (
                        <div
                          key={tIdx}
                          onClick={() => togglePlanTask(wIdx, tIdx)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                            padding: '0.6rem 0.8rem',
                            borderRadius: '6px',
                            background: isChecked ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255,255,255,0.02)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {isChecked ? (
                            <CheckCircle2 size={16} style={{ color: '#10b981', flexShrink: 0 }} />
                          ) : (
                            <Square size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                          )}
                          <span style={{
                            fontSize: '0.88rem',
                            color: isChecked ? '#e2e8f0' : 'var(--text-muted)',
                            textDecoration: isChecked ? 'line-through' : 'none'
                          }}>
                            {task}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Resources */}
                {week.resources?.length > 0 && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <BookOpen size={14} /> Recommended Study Materials:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {week.resources.map((res, rIdx) => (
                        <span
                          key={rIdx}
                          style={{
                            padding: '0.35rem 0.75rem',
                            borderRadius: '6px',
                            background: 'rgba(56, 189, 248, 0.08)',
                            border: '1px solid rgba(56, 189, 248, 0.2)',
                            color: '#7dd3fc',
                            fontSize: '0.82rem'
                          }}
                        >
                          {res}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

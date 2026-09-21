import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api.js';
import { Users, Calendar, CheckCircle, ArrowLeft, ExternalLink, Mail, Award, Clock } from 'lucide-react';

export const CandidatePipelinePage = () => {
  const { opportunityId } = useParams();
  const navigate = useNavigate();

  const [opp, setOpp] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [statusNote, setStatusNote] = useState('');

  // Interview Schedule Modal
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewForm, setInterviewForm] = useState({
    stage: 'Technical Round 1',
    scheduledAt: '',
    durationMinutes: 45,
    mode: 'video',
    meetingLink: '',
    interviewer: ''
  });

  useEffect(() => {
    loadPipeline();
  }, [opportunityId]);

  const loadPipeline = async () => {
    setLoading(true);
    try {
      const res = await api.getOpportunityApplications(opportunityId);
      setOpp(res.data.opportunity);
      setApplications(res.data.applications || []);
    } catch (err) {
      alert(err.message);
      navigate('/industry/opportunities');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await api.updateApplicationStatus(appId, { status: newStatus, note: statusNote });
      setStatusNote('');
      loadPipeline();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      await api.scheduleInterview(selectedApp._id, interviewForm);
      setShowInterviewModal(false);
      loadPipeline();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading candidate pipeline...</div>;
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1100px' }}>
      <button onClick={() => navigate('/industry/opportunities')} className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.25rem' }}>
        <ArrowLeft size={15} /> Back to My Opportunities
      </button>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase' }}>Candidate Pipeline</div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>{opp?.title}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Review applicants, examine verified competency records, advance pipeline stages, or schedule interviews.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <Users size={40} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
          <h3>No applications received yet</h3>
          <p style={{ color: 'var(--text-muted)' }}>As candidates apply, their verified profiles will appear here for review.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {applications.map(app => (
            <div key={app._id} className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                      {app.candidate?.fullName || 'Anonymous Candidate'}
                    </h3>
                    <span className="badge badge-primary" style={{ textTransform: 'uppercase', fontSize: '0.72rem' }}>
                      {app.status}
                    </span>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    {app.candidate?.institution} • {app.candidate?.department} (Batch {app.candidate?.graduationYear})
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                  {app.resumeUrl && (
                    <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-secondary">
                      <ExternalLink size={14} /> Resume
                    </a>
                  )}
                  {app.portfolioUrl && (
                    <a href={app.portfolioUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-secondary">
                      Portfolio
                    </a>
                  )}
                  <button
                    onClick={() => { setSelectedApp(app); setShowInterviewModal(true); }}
                    className="btn btn-sm btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <Calendar size={14} /> Schedule Interview
                  </button>
                </div>
              </div>

              {/* Pitch */}
              {app.coverLetter && (
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.9rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', marginBottom: '1rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  <strong style={{ color: '#fff' }}>Candidate Note: </strong>{app.coverLetter}
                </div>
              )}

              {/* Skills */}
              {app.candidate?.skills?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                  {app.candidate.skills.map((s, idx) => (
                    <span key={idx} style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', borderRadius: '4px' }}>
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {/* Status Update Pipeline Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Applied: {new Date(app.createdAt).toLocaleDateString()}
                </span>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Move to:</span>
                  {['under-review', 'shortlisted', 'selected', 'rejected'].map(st => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(app._id, st)}
                      disabled={app.status === st}
                      className={`btn btn-sm ${app.status === st ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ textTransform: 'capitalize', fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                    >
                      {st.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Interview Modal (Req 48) */}
      {showInterviewModal && selectedApp && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Schedule Interview
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Candidate: <strong>{selectedApp.candidate?.fullName}</strong>
            </p>

            <form onSubmit={handleScheduleInterview} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Interview Round / Stage</label>
                <input
                  required
                  type="text"
                  value={interviewForm.stage}
                  onChange={e => setInterviewForm({ ...interviewForm, stage: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Date & Time *</label>
                <input
                  required
                  type="datetime-local"
                  value={interviewForm.scheduledAt}
                  onChange={e => setInterviewForm({ ...interviewForm, scheduledAt: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Mode</label>
                  <select value={interviewForm.mode} onChange={e => setInterviewForm({ ...interviewForm, mode: e.target.value })} className="form-input">
                    <option value="video">Video Call</option>
                    <option value="phone">Phone Screening</option>
                    <option value="in-person">In-Person</option>
                    <option value="technical">Technical Live Coding</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Duration (Mins)</label>
                  <input
                    type="number"
                    value={interviewForm.durationMinutes}
                    onChange={e => setInterviewForm({ ...interviewForm, durationMinutes: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Meeting Link (Google Meet / Zoom / Teams)</label>
                <input
                  type="url"
                  placeholder="https://meet.google.com/..."
                  value={interviewForm.meetingLink}
                  onChange={e => setInterviewForm({ ...interviewForm, meetingLink: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowInterviewModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Confirm & Send Invite</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

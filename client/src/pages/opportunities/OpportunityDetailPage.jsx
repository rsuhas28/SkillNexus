import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  Building,
  MapPin,
  Clock,
  ShieldCheck,
  Sparkles,
  Send,
  AlertTriangle,
  Flag,
  CheckCircle,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';

export const OpportunityDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [opp, setOpp] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const [matchData, setMatchData] = useState(null);
  const [trustData, setTrustData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Apply Modal
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  // Report Modal
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSent, setReportSent] = useState(false);

  useEffect(() => {
    loadOpportunity();
  }, [id]);

  const loadOpportunity = async () => {
    setLoading(true);
    try {
      const [oppRes, trustRes] = await Promise.all([
        api.getOpportunityById(id),
        api.getOpportunityTrust(id)
      ]);
      setOpp(oppRes.data.opportunity);
      setHasApplied(oppRes.data.hasApplied);
      setApplicationData(oppRes.data.application);
      setTrustData(trustRes.data);

      if (user?.role === 'student') {
        loadAIMatch();
      }
    } catch (err) {
      alert(err.message);
      navigate('/opportunities');
    } finally {
      setLoading(false);
    }
  };

  const loadAIMatch = async () => {
    try {
      const res = await api.getOpportunityMatchExplanation(id);
      setMatchData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    try {
      const res = await api.applyToOpportunity(id, { coverLetter });
      setHasApplied(true);
      setApplicationData(res.data);
      setApplySuccess(true);
      setShowApplyModal(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setApplying(false);
    }
  };

  const handleReport = async (e) => {
    e.preventDefault();
    try {
      await api.reportOpportunity(id, { reason: reportReason });
      setReportSent(true);
      setTimeout(() => setShowReportModal(false), 2000);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading || !opp) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading opportunity details...</div>;
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1000px' }}>
      <button onClick={() => navigate('/opportunities')} className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.25rem' }}>
        <ArrowLeft size={15} /> Back to Search
      </button>

      {applySuccess && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={18} /> You have successfully submitted your application!
        </div>
      )}

      {/* Main Header Card */}
      <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>{opp.type}</span>
              {opp.isVerifiedOrg && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#10b981', fontSize: '0.8rem', fontWeight: 600 }}>
                  <ShieldCheck size={16} /> Verified Organization
                </span>
              )}
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.3rem' }}>{opp.title}</h1>
            <div style={{ fontSize: '1.05rem', color: 'var(--primary)', fontWeight: 600 }}>
              {opp.companyName}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button onClick={() => setShowReportModal(true)} className="btn btn-secondary btn-sm" title="Report this listing">
              <Flag size={14} /> Report
            </button>

            {user?.role === 'student' && (
              hasApplied ? (
                <div style={{ padding: '0.6rem 1.25rem', borderRadius: '6px', background: 'rgba(16,185,129,0.15)', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle size={16} /> Applied
                </div>
              ) : (
                <button onClick={() => setShowApplyModal(true)} className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.95rem' }}>
                  Apply Now
                </button>
              )
            )}
          </div>
        </div>

        {/* Metadata Pills */}
        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: '0.9rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          {opp.location && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <MapPin size={16} /> {opp.location}
            </span>
          )}
          {opp.workMode && <span style={{ textTransform: 'capitalize' }}>• Work Mode: {opp.workMode}</span>}
          {(opp.salary || opp.stipend) && (
            <span style={{ color: '#10b981', fontWeight: 600 }}>
              • Compensation: {opp.salary || opp.stipend}
            </span>
          )}
          {opp.duration && <span>• Duration: {opp.duration}</span>}
          {opp.deadline && <span>• Deadline: {new Date(opp.deadline).toLocaleDateString()}</span>}
        </div>
      </div>

      {/* AI Match Explanation Card (Req 33/34) */}
      {matchData && (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles className="text-primary" size={18} /> AI Opportunity Match Analysis
            </h3>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#3b82f6' }}>
              {matchData.matchPercentage}% Fit
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
            {matchData.explanation}
          </p>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.85rem' }}>
            <div>
              <strong style={{ color: '#10b981' }}>Matched Skills: </strong>
              <span style={{ color: 'var(--text-muted)' }}>
                {matchData.matchedSkills?.length > 0 ? matchData.matchedSkills.join(', ') : 'None yet'}
              </span>
            </div>
            {matchData.missingSkills?.length > 0 && (
              <div>
                <strong style={{ color: '#ef4444' }}>Target Skills to Add: </strong>
                <span style={{ color: 'var(--text-muted)' }}>{matchData.missingSkills.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Trust & Safety Analysis Badge (Req 70) */}
      {trustData && (
        <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={18} className="text-primary" /> Opportunity Trust Indicator
            </div>
            <span style={{
              padding: '0.2rem 0.6rem',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: 700,
              background: trustData.trustLevel === 'Verified' ? 'rgba(16,185,129,0.15)' :
                         trustData.trustLevel === 'Information Incomplete' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
              color: trustData.trustLevel === 'Verified' ? '#10b981' :
                     trustData.trustLevel === 'Information Incomplete' ? '#f59e0b' : '#ef4444'
            }}>
              {trustData.trustLevel}
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {trustData.note}
          </p>
        </div>
      )}

      {/* Description & Requirements */}
      <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Job Description & Responsibilities</h2>
        <div style={{ lineHeight: 1.7, color: 'var(--text-muted)', whiteSpace: 'pre-line', marginBottom: '1.5rem' }}>
          {opp.description}
        </div>

        {opp.skills?.length > 0 && (
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Required Skills & Technologies</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {opp.skills.map((s, idx) => (
                <span key={idx} style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '550px', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Apply to {opp.title}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Your verified SkillNexus profile, primary resume, and assessment credentials will be automatically shared with {opp.companyName}.
            </p>

            <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Cover Note / Pitch (Optional)
                </label>
                <textarea
                  rows={4}
                  placeholder="Highlight your relevant projects, hackathons, or why you are excited about this role..."
                  value={coverLetter}
                  onChange={e => setCoverLetter(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowApplyModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" disabled={applying} className="btn btn-primary">
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '1.75rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>Report Listing</h2>
            {reportSent ? (
              <div className="alert alert-success">Thank you. Report received for safety review.</div>
            ) : (
              <form onSubmit={handleReport} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe suspicious behavior, fee requests, or misleading claims..."
                  value={reportReason}
                  onChange={e => setReportReason(e.target.value)}
                  className="form-input"
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button type="button" onClick={() => setShowReportModal(false)} className="btn btn-secondary">Cancel</button>
                  <button type="submit" className="btn btn-danger">Submit Report</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

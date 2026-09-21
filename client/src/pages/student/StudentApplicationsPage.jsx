import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { FileText, Calendar, Award, ExternalLink, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

export const StudentApplicationsPage = () => {
  const [activeTab, setActiveTab] = useState('applications'); // 'applications' | 'interviews' | 'placements'
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [appsRes, invsRes, plcRes] = await Promise.all([
        api.getMyApplications(),
        api.getMyInterviews(),
        api.getMyPlacements()
      ]);
      setApplications(appsRes.data || []);
      setInterviews(invsRes.data || []);
      setPlacements(plcRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (id) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;
    try {
      await api.withdrawApplication(id);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const getStatusColor = (st) => {
    switch (st) {
      case 'applied': return 'badge-neutral';
      case 'under-review': return 'badge-warning';
      case 'shortlisted': return 'badge-primary';
      case 'interview': return 'badge-primary';
      case 'selected': return 'badge-success';
      case 'rejected': return 'badge-danger';
      default: return 'badge-neutral';
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1050px' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <FileText className="text-primary" size={28} />
          My Applications & Placements Tracker
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Track hiring status across every stage, access live interview links, and review verified placement offers.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setActiveTab('applications')}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'applications' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'applications' ? '#fff' : 'var(--text-muted)',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Active Applications ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab('interviews')}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'interviews' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'interviews' ? '#fff' : 'var(--text-muted)',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Calendar size={16} /> Scheduled Interviews ({interviews.length})
        </button>
        <button
          onClick={() => setActiveTab('placements')}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'placements' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'placements' ? '#fff' : 'var(--text-muted)',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Award size={16} /> Placement Offers ({placements.length})
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading records...</div>
      ) : activeTab === 'applications' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {applications.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <FileText size={40} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
              <h3>No submitted applications yet</h3>
              <p style={{ color: 'var(--text-muted)' }}>Browse opportunities and apply to kickstart your tracking.</p>
            </div>
          ) : (
            applications.map(app => (
              <div key={app._id} className="card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>{app.opportunity?.title}</h3>
                    <span className={`badge ${getStatusColor(app.status)}`} style={{ textTransform: 'uppercase', fontSize: '0.7rem' }}>
                      {app.status}
                    </span>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    {app.opportunity?.companyName} • Applied on {new Date(app.createdAt).toLocaleDateString()}
                  </div>
                  {app.recruiterNotes && (
                    <div style={{ fontSize: '0.82rem', color: 'var(--primary)', background: 'rgba(59,130,246,0.06)', padding: '0.4rem 0.8rem', borderRadius: '4px' }}>
                      Note from recruiter: {app.recruiterNotes}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {app.status !== 'withdrawn' && app.status !== 'selected' && (
                    <button onClick={() => handleWithdraw(app._id)} className="btn btn-sm btn-secondary">
                      Withdraw
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : activeTab === 'interviews' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {interviews.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <Calendar size={40} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
              <h3>No scheduled interviews</h3>
              <p style={{ color: 'var(--text-muted)' }}>When recruiters shortlist and invite you, interview schedules will appear here.</p>
            </div>
          ) : (
            interviews.map(inv => (
              <div key={inv._id} className="card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>{inv.stage}</h3>
                    <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>{inv.mode}</span>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                    {inv.opportunity?.title} • {inv.opportunity?.companyName}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 500 }}>
                    Scheduled: {new Date(inv.scheduledAt).toLocaleString()} ({inv.durationMinutes} Mins)
                  </div>
                </div>

                <div>
                  {inv.meetingLink ? (
                    <a href={inv.meetingLink} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <ExternalLink size={16} /> Join Interview
                    </a>
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Meeting link will be shared soon</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Placements */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {placements.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <Award size={40} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
              <h3>No placement records</h3>
              <p style={{ color: 'var(--text-muted)' }}>Official placement offers and selections will be displayed here.</p>
            </div>
          ) : (
            placements.map(plc => (
              <div key={plc._id} className="card" style={{ padding: '1.75rem', background: 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(255,255,255,0.02) 100%)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                  <div>
                    <span className="badge badge-success" style={{ marginBottom: '0.4rem' }}>OFFICIALLY SELECTED</span>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{plc.role}</h2>
                    <div style={{ fontSize: '1.05rem', color: '#10b981', fontWeight: 600 }}>{plc.companyName}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{plc.packageOffered || 'Competitive CTC'}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Selected: {new Date(plc.selectionDate).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

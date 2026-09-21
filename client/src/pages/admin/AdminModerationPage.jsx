import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { Flag, AlertTriangle, ShieldAlert, Trash2, CheckCircle, ExternalLink } from 'lucide-react';

export const AdminModerationPage = () => {
  const [reported, setReported] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReported();
  }, []);

  const loadReported = async () => {
    setLoading(true);
    try {
      const res = await api.getReportedOpportunities();
      setReported(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = async (id) => {
    try {
      await api.updateOpportunity(id, { reportCount: 0 });
      loadReported();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Take down and remove this flagged opportunity from the platform?')) return;
    try {
      await api.deleteOpportunity(id);
      loadReported();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1050px' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <ShieldAlert className="text-primary" size={28} />
          Trust & Safety Moderation (Req 70)
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Investigate reported opportunities flagged for suspicious claims, fees, or policy violations.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading reported items...</div>
      ) : reported.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <CheckCircle size={40} className="text-success" style={{ margin: '0 auto 1rem' }} />
          <h3>No Flagged Opportunities</h3>
          <p style={{ color: 'var(--text-muted)' }}>All active listings comply with platform trust and safety standards.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reported.map(opp => (
            <div key={opp._id} className="card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{opp.title}</h3>
                  <span className="badge badge-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <Flag size={12} /> {opp.reportCount} Report{opp.reportCount > 1 ? 's' : ''}
                  </span>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  Posted by: <strong>{opp.companyName}</strong> ({opp.contactEmail}) • Status: {opp.status}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', maxWidth: '650px', lineHeight: 1.5 }}>
                  {opp.description}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <button onClick={() => handleDismiss(opp._id)} className="btn btn-sm btn-secondary">
                  Dismiss Reports
                </button>
                <button onClick={() => handleDelete(opp._id)} className="btn btn-sm btn-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Trash2 size={14} /> Remove Listing
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

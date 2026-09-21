import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { Shield, CheckCircle, XCircle, Clock, Building, ExternalLink } from 'lucide-react';

export const AdminVerificationsPage = () => {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadVerifications();
  }, [filter]);

  const loadVerifications = async () => {
    setLoading(true);
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const res = await api.getAdminVerifications(params);
      setVerifications(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id, status) => {
    const note = prompt(`Enter review notes for marking this company as ${status}:`);
    if (note === null) return;

    try {
      await api.reviewVerification(id, { status, adminNotes: note });
      loadVerifications();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1050px' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Shield className="text-primary" size={28} />
          Company Verifications Management (Req 36)
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Review business registration credentials, legal IDs, and approve verified trust badges for employers.
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {['all', 'pending', 'verified', 'rejected'].map(st => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`btn btn-sm ${filter === st ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '20px', padding: '0.35rem 0.9rem', textTransform: 'capitalize' }}
          >
            {st}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading verification requests...</div>
      ) : verifications.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <Building size={40} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
          <h3>No verification requests in this filter</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {verifications.map(v => (
            <div key={v._id} className="card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{v.companyName}</h3>
                  <span className={`badge ${v.status === 'verified' ? 'badge-success' : v.status === 'pending' ? 'badge-warning' : 'badge-danger'}`} style={{ fontSize: '0.72rem', textTransform: 'uppercase' }}>
                    {v.status}
                  </span>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                  CIN/Reg: <strong style={{ color: '#fff' }}>{v.registrationInfo || 'N/A'}</strong> • Contact: {v.contactPerson} ({v.businessEmail})
                </div>
                {v.website && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>
                    <a href={v.website} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                      {v.website} <ExternalLink size={12} />
                    </a>
                  </div>
                )}
                {v.adminNotes && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                    Reviewer Note: {v.adminNotes}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {v.status !== 'verified' && (
                  <button onClick={() => handleReview(v._id, 'verified')} className="btn btn-sm btn-primary" style={{ background: '#10b981', borderColor: '#10b981' }}>
                    <CheckCircle size={14} /> Approve & Verify
                  </button>
                )}
                {v.status !== 'rejected' && (
                  <button onClick={() => handleReview(v._id, 'rejected')} className="btn btn-sm btn-danger">
                    <XCircle size={14} /> Reject
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { Handshake, Plus, CheckCircle, ArrowRight, BookOpen, Briefcase } from 'lucide-react';

export const CollaborationsPage = () => {
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState('all');

  const [form, setForm] = useState({
    type: 'research',
    title: '',
    description: '',
    skills: '',
    timeline: '',
    funding: '',
    deliverables: ''
  });

  useEffect(() => {
    loadCollaborations();
  }, [selectedType]);

  const loadCollaborations = async () => {
    setLoading(true);
    try {
      const params = selectedType !== 'all' ? { type: selectedType } : {};
      const res = await api.getCollaborations(params);
      setCollaborations(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.createCollaboration(form);
      setShowModal(false);
      setForm({ type: 'research', title: '', description: '', skills: '', timeline: '', funding: '', deliverables: '' });
      loadCollaborations();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleJoin = async (id) => {
    if (!window.confirm('Express partnership interest in this collaboration initiative?')) return;
    try {
      await api.joinCollaboration(id);
      alert('Partnership request submitted successfully!');
      loadCollaborations();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1050px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Handshake className="text-primary" size={28} />
            Academia–Industry Collaborations
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Partner on industrial consultancy, sponsored research projects, and student live problem statements.
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Plus size={16} /> New Proposal
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto' }}>
        {['all', 'research', 'consultancy', 'live_project'].map(t => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`btn btn-sm ${selectedType === t ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '20px', padding: '0.35rem 0.9rem', textTransform: 'capitalize' }}
          >
            {t.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading collaboration proposals...</div>
      ) : collaborations.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <Handshake size={40} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
          <h3>No active collaboration initiatives</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>Post a research proposal or industry consultancy project.</p>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">Create Proposal</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '1.25rem' }}>
          {collaborations.map(c => (
            <div key={c._id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className="badge badge-primary" style={{ textTransform: 'capitalize', fontSize: '0.72rem' }}>
                    {c.type.replace('_', ' ')}
                  </span>
                  <span className={`badge ${c.status === 'open' ? 'badge-success' : 'badge-neutral'}`} style={{ fontSize: '0.7rem' }}>
                    {c.status}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>{c.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                  {c.description}
                </p>

                {c.funding && (
                  <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600, marginBottom: '0.5rem' }}>
                    Grant / Budget: {c.funding}
                  </div>
                )}
                {c.timeline && (
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Timeline: {c.timeline}
                  </div>
                )}
              </div>

              <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {c.partnerName ? `Partnered with ${c.partnerName}` : 'Seeking Partner'}
                </span>
                {c.status === 'open' && (
                  <button onClick={() => handleJoin(c._id)} className="btn btn-sm btn-primary">
                    Express Interest
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Proposal Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '550px', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '1.25rem' }}>
              Publish Collaboration Initiative
            </h2>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Collaboration Type *</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="form-input">
                  <option value="research">Sponsored / Joint Research</option>
                  <option value="consultancy">Industry Technical Consultancy</option>
                  <option value="live_project">Live Student Capstone Project</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Initiative Title *</label>
                <input required type="text" placeholder="e.g. AI-driven Supply Chain Optimization" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="form-input" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Scope & Objectives</label>
                <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="form-input" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Expected Timeline</label>
                  <input type="text" placeholder="e.g. 6 Months" value={form.timeline} onChange={e => setForm({ ...form, timeline: e.target.value })} className="form-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Budget / Grant / Funding</label>
                  <input type="text" placeholder="e.g. ₹5,00,000" value={form.funding} onChange={e => setForm({ ...form, funding: e.target.value })} className="form-input" />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Publish Proposal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

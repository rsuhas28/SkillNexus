import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api.js';
import { Briefcase, Plus, Users, Edit2, Trash2, CheckCircle, ShieldCheck } from 'lucide-react';

export const IndustryOpportunitiesPage = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    type: 'job',
    title: '',
    description: '',
    skills: '',
    location: '',
    workMode: 'remote',
    salary: '',
    stipend: '',
    duration: '',
    openings: 1
  });

  useEffect(() => {
    loadOpportunities();
  }, []);

  const loadOpportunities = async () => {
    setLoading(true);
    try {
      const res = await api.getMyOpportunities();
      setOpportunities(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateOpportunity(editingId, form);
      } else {
        await api.createOpportunity(form);
      }
      setShowModal(false);
      setEditingId(null);
      setForm({ type: 'job', title: '', description: '', skills: '', location: '', workMode: 'remote', salary: '', stipend: '', duration: '', openings: 1 });
      loadOpportunities();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this opportunity listing?')) return;
    try {
      await api.deleteOpportunity(id);
      loadOpportunities();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Briefcase className="text-primary" size={28} />
            Manage Industry Opportunities
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Publish jobs, internships, apprenticeships, and live projects to recruit verified talent.
          </p>
        </div>
        <button
          onClick={() => { setEditingId(null); setShowModal(true); }}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Plus size={16} /> Post Opportunity
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading your listings...</div>
      ) : opportunities.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <Briefcase size={40} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
          <h3>No opportunities posted yet</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Create your first listing to start receiving applications from qualified candidates.
          </p>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">Post Opportunity Now</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '1.25rem' }}>
          {opportunities.map(opp => (
            <div key={opp._id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span className="badge badge-primary" style={{ textTransform: 'capitalize', fontSize: '0.72rem' }}>
                    {opp.type}
                  </span>
                  <span className={`badge ${opp.status === 'published' ? 'badge-success' : 'badge-neutral'}`} style={{ fontSize: '0.7rem' }}>
                    {opp.status}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.3rem' }}>{opp.title}</h3>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                  {opp.workMode} • {opp.location || 'Remote'}
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', lineHeight: 1.5, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {opp.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '1rem' }}>
                  <Users size={16} /> {opp.applicationCount || 0} Candidate Applications
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={() => navigate(`/industry/opportunities/${opp._id}/applications`)}
                  className="btn btn-sm btn-primary"
                >
                  View Pipeline ({opp.applicationCount || 0})
                </button>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    onClick={() => {
                      setEditingId(opp._id);
                      setForm({
                        type: opp.type,
                        title: opp.title,
                        description: opp.description || '',
                        skills: (opp.skills || []).join(', '),
                        location: opp.location || '',
                        workMode: opp.workMode || 'remote',
                        salary: opp.salary || '',
                        stipend: opp.stipend || '',
                        duration: opp.duration || '',
                        openings: opp.openings || 1
                      });
                      setShowModal(true);
                    }}
                    className="btn btn-sm btn-secondary"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(opp._id)} className="btn btn-sm btn-danger">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '1.25rem' }}>
              {editingId ? 'Edit Opportunity' : 'Post New Opportunity'}
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Opportunity Type *</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="form-input">
                    <option value="job">Full-Time Job</option>
                    <option value="internship">Internship</option>
                    <option value="apprenticeship">Apprenticeship</option>
                    <option value="project">Industry Project</option>
                    <option value="training">Training / Certification</option>
                    <option value="mentorship">Mentorship Program</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Work Mode</label>
                  <select value={form.workMode} onChange={e => setForm({ ...form, workMode: e.target.value })} className="form-input">
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="on-site">On-Site</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Role Title *</label>
                <input required type="text" placeholder="e.g. Junior Backend Engineer" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="form-input" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Detailed Description & Requirements</label>
                <textarea rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="form-input" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Required Skills (comma separated)</label>
                <input type="text" placeholder="e.g. Node.js, Express, MongoDB, Docker" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} className="form-input" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Location</label>
                  <input type="text" placeholder="e.g. Bangalore / Remote" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="form-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Compensation (Salary / Stipend)</label>
                  <input type="text" placeholder="e.g. ₹8-12 LPA or ₹30k/mo" value={form.salary || form.stipend} onChange={e => setForm({ ...form, salary: e.target.value, stipend: e.target.value })} className="form-input" />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Save Changes' : 'Publish Opportunity'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

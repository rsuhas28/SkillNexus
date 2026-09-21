import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import { RoleBadge } from '../../components/RoleBadge.jsx';
import { Save, CheckCircle2, AlertCircle } from 'lucide-react';

export const AcademicianProfile = () => {
  const { user, profile, refreshUser } = useAuth();

  const [designation, setDesignation] = useState(profile?.designation || 'Assistant Professor');
  const [department, setDepartment] = useState(profile?.department || 'Computer Science & Engineering');
  const [institutionName, setInstitutionName] = useState(profile?.institutionName || '');
  const [researchAreasStr, setResearchAreasStr] = useState((profile?.researchAreas || ['AI', 'Data Science']).join(', '));

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(''); setError('');
    try {
      const researchAreas = researchAreasStr.split(',').map(s => s.trim()).filter(Boolean);
      await api.updateMe({ name: user?.name, profileData: { designation, department, institutionName, researchAreas } });
      await refreshUser();
      setMessage('Faculty profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem' }}>Faculty Profile</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Academic credentials, research focus, and industry collaboration preferences</p>
        </div>
        <RoleBadge role="academician" />
      </div>

      {message && <div className="alert-box alert-success"><CheckCircle2 size={18} /><div>{message}</div></div>}
      {error && <div className="alert-box alert-error"><AlertCircle size={18} /><div>{error}</div></div>}

      <form onSubmit={handleSave} className="card">
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input type="text" className="form-input" value={user?.name || ''} disabled style={{ opacity: 0.7 }} />
        </div>
        <div className="form-group">
          <label className="form-label">Official Email</label>
          <input type="email" className="form-input" value={user?.email || ''} disabled style={{ opacity: 0.7 }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Designation / Title</label>
            <input type="text" className="form-input" value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="Associate Professor" />
          </div>
          <div className="form-group">
            <label className="form-label">Department</label>
            <input type="text" className="form-input" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Computer Science & Engineering" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Institution / University</label>
          <input type="text" className="form-input" value={institutionName} onChange={(e) => setInstitutionName(e.target.value)} placeholder="Apex Institute of Science" />
        </div>
        <div className="form-group">
          <label className="form-label">Research Areas (Comma separated)</label>
          <input type="text" className="form-input" value={researchAreasStr} onChange={(e) => setResearchAreasStr(e.target.value)} placeholder="Artificial Intelligence, Distributed Systems, Cybersecurity" />
        </div>
        <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
          <Save size={18} /> {saving ? 'Saving...' : 'Save Faculty Profile'}
        </button>
      </form>
    </div>
  );
};

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import { RoleBadge } from '../../components/RoleBadge.jsx';
import { Save, CheckCircle2, AlertCircle } from 'lucide-react';

export const InstitutionProfile = () => {
  const { user, profile, refreshUser } = useAuth();

  const [institutionName, setInstitutionName] = useState(profile?.institutionName || user?.name || '');
  const [institutionType, setInstitutionType] = useState(profile?.institutionType || 'University / Technical Institute');
  const [campusLocation, setCampusLocation] = useState(profile?.campusLocation || '');
  const [website, setWebsite] = useState(profile?.website || '');

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setMessage(''); setError('');
    try {
      await api.updateMe({
        name: institutionName,
        profileData: { institutionName, institutionType, campusLocation, website }
      });
      await refreshUser();
      setMessage('Institution profile updated successfully!');
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
          <h1 style={{ fontSize: '1.75rem' }}>Institution Profile</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Official institution details, type, and contact preferences</p>
        </div>
        <RoleBadge role="institution" />
      </div>

      {message && <div className="alert-box alert-success"><CheckCircle2 size={18} /><div>{message}</div></div>}
      {error && <div className="alert-box alert-error"><AlertCircle size={18} /><div>{error}</div></div>}

      <form onSubmit={handleSave} className="card">
        <div className="form-group">
          <label className="form-label">Institution Name</label>
          <input type="text" className="form-input" value={institutionName} onChange={(e) => setInstitutionName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">Administrator Email</label>
          <input type="email" className="form-input" value={user?.email || ''} disabled style={{ opacity: 0.7 }} />
        </div>
        <div className="form-group">
          <label className="form-label">Institution Type</label>
          <input type="text" className="form-input" value={institutionType} onChange={(e) => setInstitutionType(e.target.value)} placeholder="Tier-1 Technical University" />
        </div>
        <div className="form-group">
          <label className="form-label">Campus Location</label>
          <input type="text" className="form-input" value={campusLocation} onChange={(e) => setCampusLocation(e.target.value)} placeholder="Innovation Park, East Campus" />
        </div>
        <div className="form-group">
          <label className="form-label">Official Website</label>
          <input type="url" className="form-input" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://university.edu" />
        </div>
        <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
          <Save size={18} /> {saving ? 'Saving...' : 'Save Institution Profile'}
        </button>
      </form>
    </div>
  );
};

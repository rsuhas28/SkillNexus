import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import { RoleBadge } from '../../components/RoleBadge.jsx';
import { Briefcase, Building, Globe, Save, CheckCircle2, AlertCircle } from 'lucide-react';

export const IndustryProfile = () => {
  const { user, profile, refreshUser } = useAuth();

  const [companyName, setCompanyName] = useState(profile?.companyName || user?.name || '');
  const [industrySector, setIndustrySector] = useState(profile?.industrySector || 'Technology & Innovation');
  const [companySize, setCompanySize] = useState(profile?.companySize || '50-250 Employees');
  const [website, setWebsite] = useState(profile?.website || 'https://techcorp.example.com');
  const [description, setDescription] = useState(profile?.description || '');

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      await api.updateMe({
        name: companyName,
        profileData: {
          companyName,
          industrySector,
          companySize,
          website,
          description
        }
      });
      await refreshUser();
      setMessage('Company profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update company profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem' }}>Company Profile</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Enterprise branding, sector focus, and institutional engagement settings
          </p>
        </div>
        <RoleBadge role="industry" />
      </div>

      {message && (
        <div className="alert-box alert-success">
          <CheckCircle2 size={18} /> <div>{message}</div>
        </div>
      )}

      {error && (
        <div className="alert-box alert-error">
          <AlertCircle size={18} /> <div>{error}</div>
        </div>
      )}

      <form onSubmit={handleSave} className="card">
        <div className="form-group">
          <label className="form-label">Company Name</label>
          <input
            type="text"
            className="form-input"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Authorized Account Email</label>
          <input
            type="email"
            className="form-input"
            value={user?.email || ''}
            disabled
            style={{ opacity: 0.7 }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Industry Sector</label>
            <input
              type="text"
              className="form-input"
              value={industrySector}
              onChange={(e) => setIndustrySector(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Organization Size</label>
            <input
              type="text"
              className="form-input"
              value={companySize}
              onChange={(e) => setCompanySize(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Official Website</label>
          <input
            type="url"
            className="form-input"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Company Overview</label>
          <textarea
            className="form-input"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell students and academia about your company's mission and culture..."
          />
        </div>

        <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
          <Save size={18} /> {saving ? 'Saving...' : 'Save Company Details'}
        </button>
      </form>
    </div>
  );
};

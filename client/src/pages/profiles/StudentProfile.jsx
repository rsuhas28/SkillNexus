import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import { RoleBadge } from '../../components/RoleBadge.jsx';
import { User, Award, Building, BookOpen, CheckCircle2, AlertCircle, Save } from 'lucide-react';

export const StudentProfile = () => {
  const { user, profile, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [headline, setHeadline] = useState(profile?.headline || '');
  const [institutionName, setInstitutionName] = useState(profile?.institutionName || '');
  const [degree, setDegree] = useState(profile?.degree || '');
  const [graduationYear, setGraduationYear] = useState(profile?.graduationYear || '2026');
  const [skillsStr, setSkillsStr] = useState((profile?.skills || ['JavaScript', 'React', 'Problem Solving']).join(', '));

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const skills = skillsStr.split(',').map(s => s.trim()).filter(Boolean);
      await api.updateMe({
        name,
        profileData: {
          headline,
          institutionName,
          degree,
          graduationYear,
          skills
        }
      });
      await refreshUser();
      setMessage('Profile updated successfully!');
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
          <h1 style={{ fontSize: '1.75rem' }}>Student Profile</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Manage your academic credentials and showcase your technical identity
          </p>
        </div>
        <RoleBadge role="student" />
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
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Account Email (System Identity)</label>
          <input
            type="email"
            className="form-input"
            value={user?.email || ''}
            disabled
            style={{ opacity: 0.7 }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Professional Headline</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Computer Science Student | Cloud Enthusiast"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Institution / University</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Apex Institute of Technology"
              value={institutionName}
              onChange={(e) => setInstitutionName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Degree & Major</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. B.Tech Computer Science"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Expected Graduation Year</label>
          <input
            type="text"
            className="form-input"
            placeholder="2026"
            value={graduationYear}
            onChange={(e) => setGraduationYear(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Key Skills (Comma separated)</label>
          <input
            type="text"
            className="form-input"
            placeholder="React, Python, Node.js, Cloud Computing"
            value={skillsStr}
            onChange={(e) => setSkillsStr(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
          <Save size={18} /> {saving ? 'Saving...' : 'Save Profile Changes'}
        </button>
      </form>
    </div>
  );
};

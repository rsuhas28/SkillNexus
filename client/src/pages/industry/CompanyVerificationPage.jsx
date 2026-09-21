import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { ShieldCheck, Upload, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export const CompanyVerificationPage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const [form, setForm] = useState({
    companyName: '',
    registrationInfo: '',
    contactPerson: '',
    businessEmail: '',
    website: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await api.getCompanyProfile();
      setProfileData(res.data);
      if (res.data?.profile) {
        setForm({
          companyName: res.data.profile.companyName || '',
          registrationInfo: res.data.verification?.registrationInfo || '',
          contactPerson: res.data.profile.contactPerson || '',
          businessEmail: res.data.verification?.businessEmail || '',
          website: res.data.profile.website || ''
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.submitVerification(form);
      setMessage('Verification submitted successfully. Platform administrators will review your credentials.');
      loadProfile();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const status = profileData?.verificationStatus || 'unverified';

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '850px' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <ShieldCheck className="text-primary" size={28} />
          Company Verification & Trust Badge
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Verified organizations unlock highlighted job listings, increased applicant trust, and priority campus placement drives.
        </p>
      </div>

      {message && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={18} /> {message}
        </div>
      )}

      {/* Status Card */}
      <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Current Status</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, textTransform: 'capitalize', color: status === 'verified' ? '#10b981' : status === 'pending' ? '#f59e0b' : 'var(--text-muted)' }}>
            {status}
          </div>
        </div>

        <div>
          {status === 'verified' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontWeight: 600 }}>
              <CheckCircle size={20} /> Verified SkillNexus Partner
            </div>
          )}
          {status === 'pending' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f59e0b', fontWeight: 600 }}>
              <Clock size={20} /> Under Administrative Review
            </div>
          )}
        </div>
      </div>

      {/* Submission Form */}
      <div className="card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.25rem' }}>
          Submit Company Credentials
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Registered Legal Entity Name *</label>
            <input
              required
              type="text"
              value={form.companyName}
              onChange={e => setForm({ ...form, companyName: e.target.value })}
              className="form-input"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>CIN / Registration Number / Tax ID *</label>
            <input
              required
              type="text"
              placeholder="e.g. U72200KA2020PTC..."
              value={form.registrationInfo}
              onChange={e => setForm({ ...form, registrationInfo: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Official Contact Person *</label>
              <input
                required
                type="text"
                value={form.contactPerson}
                onChange={e => setForm({ ...form, contactPerson: e.target.value })}
                className="form-input"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Corporate Email *</label>
              <input
                required
                type="email"
                placeholder="recruiting@company.com"
                value={form.businessEmail}
                onChange={e => setForm({ ...form, businessEmail: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Official Website</label>
            <input
              type="url"
              placeholder="https://company.com"
              value={form.website}
              onChange={e => setForm({ ...form, website: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="submit" disabled={submitting} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} /> {submitting ? 'Submitting...' : 'Submit for Verification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

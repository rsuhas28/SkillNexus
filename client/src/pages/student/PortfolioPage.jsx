import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { Globe, Eye, EyeOff, Link as LinkIcon, Share2, ExternalLink, Save, CheckCircle, Copy } from 'lucide-react';

export const PortfolioPage = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    setLoading(true);
    try {
      const res = await api.getPortfolio();
      setPortfolio(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSection = (sectionId) => {
    const updated = portfolio.sections.map(s =>
      s.id === sectionId ? { ...s, visible: !s.visible } : s
    );
    setPortfolio({ ...portfolio, sections: updated });
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await api.updatePortfolio({
        slug: portfolio.slug,
        isPublic: portfolio.isPublic,
        sections: portfolio.sections,
        customLinks: portfolio.customLinks || []
      });
      setMessage('Portfolio settings published successfully');
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const publicUrl = `${window.location.origin}/portfolio/${portfolio?.slug || ''}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading portfolio settings...</div>;
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Globe className="text-primary" size={28} />
            Digital Portfolio Builder
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Configure sections, personalize your public URL, and publish your student portfolio to employers.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <a
            href={`/portfolio/${portfolio?.slug}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <ExternalLink size={16} /> Preview Portfolio
          </a>
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Save size={16} /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      {message && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={18} /> {message}
        </div>
      )}

      {/* Visibility & URL Card */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>Public Link & Access</h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Portfolio Visibility</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              When enabled, recruiters and academic reviewers can view your portfolio via your public URL.
            </div>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={portfolio?.isPublic || false}
              onChange={e => setPortfolio({ ...portfolio, isPublic: e.target.checked })}
              style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
            />
            <span style={{ fontWeight: 600, color: portfolio?.isPublic ? '#10b981' : 'var(--text-muted)' }}>
              {portfolio?.isPublic ? 'Public' : 'Private'}
            </span>
          </label>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 500 }}>
            Custom Portfolio Slug (URL)
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <div style={{ padding: '0.65rem 0.9rem', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {window.location.origin}/portfolio/
            </div>
            <input
              type="text"
              value={portfolio?.slug || ''}
              onChange={e => setPortfolio({ ...portfolio, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
              className="form-input"
              style={{ flex: 1 }}
              placeholder="e.g. alex-developer"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}
            >
              {copied ? <CheckCircle size={16} className="text-success" /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
      </div>

      {/* Sections Config Card */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>Visible Portfolio Sections</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          Toggle which sections appear on your public digital portfolio.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {(portfolio?.sections || []).map(section => (
            <div
              key={section.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.9rem 1.25rem',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{section.type}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Order #{section.order}</span>
              </div>
              <button
                type="button"
                onClick={() => handleToggleSection(section.id)}
                className={`btn btn-sm ${section.visible ? 'btn-primary' : 'btn-secondary'}`}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                {section.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                {section.visible ? 'Visible' : 'Hidden'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

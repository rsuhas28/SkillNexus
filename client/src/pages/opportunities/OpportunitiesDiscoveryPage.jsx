import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api.js';
import {
  Compass,
  Search,
  Filter,
  MapPin,
  Briefcase,
  ShieldCheck,
  Clock,
  ArrowRight,
  Building,
  CheckCircle
} from 'lucide-react';

export const OpportunitiesDiscoveryPage = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchKw, setSearchKw] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [workMode, setWorkMode] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOpportunities();
  }, [selectedType, workMode, verifiedOnly]);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchKw.trim()) params.keyword = searchKw.trim();
      if (selectedType !== 'all') params.type = selectedType;
      if (workMode) params.workMode = workMode;
      if (verifiedOnly) params.verifiedOnly = 'true';

      const res = await api.searchOpportunities(params);
      setOpportunities(res.data.opportunities || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOpportunities();
  };

  const types = [
    { id: 'all', label: 'All Opportunities' },
    { id: 'job', label: 'Full-Time Jobs' },
    { id: 'internship', label: 'Internships' },
    { id: 'apprenticeship', label: 'Apprenticeships' },
    { id: 'project', label: 'Industry Projects' },
    { id: 'mentorship', label: 'Mentorship' }
  ];

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1100px' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Compass className="text-primary" size={28} />
          Explore Industry Opportunities
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Verified jobs, internships, apprenticeships, and live projects directly from industry partners.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by role title, skill (e.g. React), or company name..."
              value={searchKw}
              onChange={e => setSearchKw(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Search size={16} /> Search
          </button>
        </form>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {types.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                className={`btn btn-sm ${selectedType === t.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: '20px', padding: '0.35rem 0.85rem' }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.5rem' }}>
            <select
              value={workMode}
              onChange={e => setWorkMode(e.target.value)}
              className="form-input"
              style={{ padding: '0.35rem 0.8rem', fontSize: '0.85rem' }}
            >
              <option value="">All Work Modes</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="on-site">On-Site</option>
            </select>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={e => setVerifiedOnly(e.target.checked)}
              />
              <ShieldCheck size={16} className="text-success" /> Verified Orgs Only
            </label>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        Showing {opportunities.length} of {total} open opportunities
      </div>

      {/* Opportunities Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Searching listings...</div>
      ) : opportunities.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <Briefcase size={40} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
          <h3>No opportunities match your current filters</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>Try clearing keywords or adjusting the filter criteria.</p>
          <button onClick={() => { setSearchKw(''); setSelectedType('all'); setWorkMode(''); setVerifiedOnly(false); }} className="btn btn-secondary">
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '1.25rem' }}>
          {opportunities.map(opp => (
            <div
              key={opp._id}
              className="card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease, border-color 0.2s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span className="badge badge-primary" style={{ textTransform: 'capitalize', fontSize: '0.72rem' }}>
                    {opp.type}
                  </span>
                  {opp.isVerifiedOrg && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#10b981', fontSize: '0.75rem', fontWeight: 600 }}>
                      <ShieldCheck size={14} /> Verified Org
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.35rem' }}>{opp.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                  <Building size={15} /> {opp.companyName || 'SkillNexus Partner'}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '1rem' }}>
                  {opp.location && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <MapPin size={13} /> {opp.location}
                    </span>
                  )}
                  {opp.workMode && <span style={{ textTransform: 'capitalize' }}>• {opp.workMode}</span>}
                  {(opp.salary || opp.stipend) && (
                    <span style={{ color: '#10b981', fontWeight: 600 }}>
                      • {opp.salary || opp.stipend}
                    </span>
                  )}
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', lineHeight: 1.5, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {opp.description}
                </p>

                {opp.skills?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                    {opp.skills.slice(0, 4).map((s, idx) => (
                      <span key={idx} style={{ fontSize: '0.75rem', padding: '0.15rem 0.45rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                        {s}
                      </span>
                    ))}
                    {opp.skills.length > 4 && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>+{opp.skills.length - 4} more</span>
                    )}
                  </div>
                )}
              </div>

              <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {opp.applicationCount || 0} applicants
                </span>
                <button
                  onClick={() => navigate(`/opportunities/${opp._id}`)}
                  className="btn btn-sm btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  View Details <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

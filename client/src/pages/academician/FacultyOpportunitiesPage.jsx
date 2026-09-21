import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { Briefcase, Award, GraduationCap, Building, MapPin, Clock, ArrowRight } from 'lucide-react';

export const FacultyOpportunitiesPage = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    loadFacultyOpps();
  }, [selectedType]);

  const loadFacultyOpps = async () => {
    setLoading(true);
    try {
      const params = selectedType !== 'all' ? { type: selectedType } : {};
      const res = await api.getFacultyOpportunities(params);
      setOpportunities(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const types = [
    { id: 'all', label: 'All Faculty Opps' },
    { id: 'faculty_internship', label: 'Faculty Internships' },
    { id: 'industrial_training', label: 'Industrial Training' },
    { id: 'fdp', label: 'Faculty Dev Programs (FDP)' },
    { id: 'workshop', label: 'Workshops' },
    { id: 'guest_lecture', label: 'Guest Lectures' }
  ];

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1050px' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <GraduationCap className="text-primary" size={28} />
          Faculty Industrial Immersion & Development
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Explore sabbatical internships, industrial training programs, FDPs, and guest lecture invitations.
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
        {types.map(t => (
          <button
            key={t.id}
            onClick={() => setSelectedType(t.id)}
            className={`btn btn-sm ${selectedType === t.id ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '20px', padding: '0.35rem 0.9rem', whiteSpace: 'nowrap' }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading faculty opportunities...</div>
      ) : opportunities.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <Briefcase size={40} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
          <h3>No faculty programs currently available</h3>
          <p style={{ color: 'var(--text-muted)' }}>Industry partners post immersive training programs and FDPs regularly.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {opportunities.map(opp => (
            <div key={opp._id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className="badge badge-primary" style={{ textTransform: 'capitalize', fontSize: '0.72rem' }}>
                    {opp.type.replace('_', ' ')}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.35rem' }}>{opp.title}</h3>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                  {opp.companyName} • {opp.location || 'Remote'}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                  {opp.description}
                </p>
              </div>

              <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>
                  {opp.stipend || opp.salary || 'Sponsored / Free'}
                </span>
                <a href={`/opportunities/${opp._id}`} className="btn btn-sm btn-primary">
                  View Program
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

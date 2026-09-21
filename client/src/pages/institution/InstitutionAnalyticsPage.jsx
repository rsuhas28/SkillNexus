import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { BarChart3, TrendingUp, Users, Briefcase, Award, GraduationCap } from 'lucide-react';

export const InstitutionAnalyticsPage = () => {
  const [stats, setStats] = useState(null);
  const [skillAnalytics, setSkillAnalytics] = useState(null);
  const [placementAnalytics, setPlacementAnalytics] = useState(null);
  const [demandAnalytics, setDemandAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [overviewRes, skillsRes, plcRes, demandRes] = await Promise.all([
        api.getAnalyticsOverview(),
        api.getSkillAnalytics(),
        api.getPlacementAnalytics(),
        api.getSkillDemandAnalytics()
      ]);
      setStats(overviewRes.data);
      setSkillAnalytics(skillsRes.data);
      setPlacementAnalytics(plcRes.data);
      setDemandAnalytics(demandRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Aggregating campus analytics...</div>;
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1100px' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <BarChart3 className="text-primary" size={28} />
          Institutional Skill & Placement Intelligence
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Real-time aggregated metrics across student skill proficiencies, placement conversions, and industry demand benchmarks.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Students Enrolled</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{stats?.totalStudents || 0}</div>
        </div>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Placement Rate</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981' }}>{stats?.placementRate || 0}%</div>
        </div>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active Opportunities</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#3b82f6' }}>{stats?.activeOpportunities || 0}</div>
        </div>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Assessments Cleared</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f59e0b' }}>{stats?.completedAssessments || 0}</div>
        </div>
      </div>

      {/* Charts Row 1: Skill Distribution & Industry Demand vs Supply */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Top Skills Chart */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1rem' }}>
            Top Acquired Student Competencies
          </h2>
          <div style={{ height: '300px', width: '100%' }}>
            {skillAnalytics?.topSkills?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillAnalytics.topSkills}>
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} />
                  <Tooltip contentStyle={{ background: '#1e293b', borderColor: '#334155' }} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                No skill records recorded yet
              </div>
            )}
          </div>
        </div>

        {/* Skill Demand vs Supply */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1rem' }}>
            Industry Demand vs Student Supply (Req 64)
          </h2>
          <div style={{ height: '300px', width: '100%' }}>
            {demandAnalytics?.skillDemandVsSupply?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demandAnalytics.skillDemandVsSupply.slice(0, 6)}>
                  <XAxis dataKey="skill" stroke="var(--text-muted)" fontSize={12} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} />
                  <Tooltip contentStyle={{ background: '#1e293b', borderColor: '#334155' }} />
                  <Legend />
                  <Bar dataKey="industryDemand" fill="#ec4899" name="Industry Demand" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="studentSupply" fill="#10b981" name="Student Supply" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                Comparing active listings and profiles...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Charts Row 2: Department & Proficiency Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}>
        {/* Proficiency Distribution */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1rem' }}>
            Competency Proficiency Distribution
          </h2>
          <div style={{ height: '280px', width: '100%' }}>
            {skillAnalytics?.proficiencyDistribution?.some(p => p.count > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={skillAnalytics.proficiencyDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="count"
                    nameKey="level"
                    label
                  >
                    {skillAnalytics.proficiencyDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1e293b', borderColor: '#334155' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                Pending student competency data
              </div>
            )}
          </div>
        </div>

        {/* Top Hiring Recruiters */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1rem' }}>
            Placement Recruiters & Roles
          </h2>
          {placementAnalytics?.topRecruiters?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {placementAnalytics.topRecruiters.map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.8rem', borderRadius: '6px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontWeight: 600 }}>{r.company}</span>
                  <span style={{ color: '#10b981', fontWeight: 700 }}>{r.hires} Hires</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              No campus placement offers recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

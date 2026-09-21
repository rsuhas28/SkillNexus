import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import { RoleBadge } from '../../components/RoleBadge.jsx';
import {
  Users,
  GraduationCap,
  Briefcase,
  BookOpen,
  Building2,
  ShieldCheck,
  AlertTriangle,
  UserCheck,
  Clock,
  TrendingUp
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.getAdminStats();
        if (res.success) setStats(res.stats);
      } catch (err) {
        console.error('Failed to fetch admin stats:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = stats
    ? [
        { label: 'Total Platform Users', value: stats.totalUsers, icon: Users, color: '#818cf8', bg: 'rgba(99,102,241,0.15)' },
        { label: 'Registered Students', value: stats.students, icon: GraduationCap, color: '#38bdf8', bg: 'rgba(2,132,199,0.15)' },
        { label: 'Industry Partners', value: stats.industry, icon: Briefcase, color: '#a78bfa', bg: 'rgba(124,58,237,0.15)' },
        { label: 'Academicians', value: stats.academicians, icon: BookOpen, color: '#34d399', bg: 'rgba(5,150,105,0.15)' },
        { label: 'Institutions', value: stats.institutions, icon: Building2, color: '#fbbf24', bg: 'rgba(217,119,6,0.15)' },
        { label: 'Pending Email Verification', value: stats.pendingVerification, icon: Clock, color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
        { label: 'Suspended / Blocked', value: stats.suspendedCount, icon: AlertTriangle, color: '#f87171', bg: 'rgba(239,68,68,0.15)' },
        { label: 'Admins', value: stats.admins, icon: ShieldCheck, color: '#fb7185', bg: 'rgba(225,29,72,0.15)' }
      ]
    : [];

  return (
    <div>
      {/* Admin Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(225, 29, 72, 0.12) 0%, rgba(99, 102, 241, 0.12) 100%)',
        border: '1px solid rgba(225, 29, 72, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <h1 style={{ fontSize: '1.85rem' }}>Platform Control Center</h1>
            <RoleBadge role="admin" />
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Welcome, {user?.name} — Managing user governance, roles, and platform health.
          </p>
        </div>
        <Link to="/admin/users" className="btn btn-primary" id="btn-goto-user-management">
          <Users size={16} /> User Management
        </Link>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          Loading platform statistics...
        </div>
      ) : (
        <>
          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            {statCards.map((s, i) => {
              const Icon = s.icon;
              return (
                <div className="stat-card" key={i}>
                  <div className="stat-icon" style={{ background: s.bg, color: s.color }}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <div className="stat-value">{s.value}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Registrations */}
          {stats?.recentRegistrations?.length > 0 && (
            <div className="card" style={{ marginTop: '2rem' }}>
              <div className="card-header">
                <h3 className="card-title"><UserCheck size={18} color="#818cf8" /> Recent Registrations</h3>
                <Link to="/admin/users" className="btn btn-secondary btn-sm">View All</Link>
              </div>
              <div className="table-container" style={{ border: 'none', background: 'transparent' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Verified</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentRegistrations.map((u, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 500 }}>{u.name}</td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{u.email}</td>
                        <td><RoleBadge role={u.role} showIcon={false} /></td>
                        <td>
                          <span className={`badge badge-${u.accountStatus || 'active'}`}>
                            {u.accountStatus || 'active'}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.85rem', color: u.emailVerified ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
                            {u.emailVerified ? '✓ Verified' : '⏳ Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

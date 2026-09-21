import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { RoleBadge, StatusBadge } from '../../components/RoleBadge.jsx';
import { Users, Search, Filter, RefreshCw, ShieldOff, ShieldCheck, Ban, AlertTriangle } from 'lucide-react';

const STATUS_OPTIONS = ['active', 'suspended', 'blocked', 'pending'];
const ROLE_OPTIONS = ['all', 'student', 'industry', 'academician', 'institution', 'admin'];

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [actionLoading, setActionLoading] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filterRole !== 'all') params.role = filterRole;
      if (filterStatus !== 'all') params.status = filterStatus;
      if (search.trim()) params.search = search.trim();

      const res = await api.getAdminUsers(params);
      if (res.success) setUsers(res.users || []);
    } catch (err) {
      setError(err.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [filterRole, filterStatus]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleStatusChange = async (userId, uid, newStatus) => {
    const key = userId || uid;
    setActionLoading((prev) => ({ ...prev, [key]: true }));
    setMessage(''); setError('');
    try {
      await api.updateUserStatus(uid, newStatus);
      setMessage(`User status updated to "${newStatus}" successfully.`);
      await fetchUsers();
    } catch (err) {
      setError(err.message || 'Failed to update user status.');
    } finally {
      setActionLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>User Management</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          View, search, filter, and manage account status across all {users.length} registered platform users.
        </p>
      </div>

      {message && (
        <div className="alert-box alert-success" style={{ marginBottom: '1rem' }}>
          <ShieldCheck size={18} /><div>{message}</div>
        </div>
      )}

      {error && (
        <div className="alert-box alert-error" style={{ marginBottom: '1rem' }}>
          <AlertTriangle size={18} /><div>{error}</div>
        </div>
      )}

      {/* Filters Bar */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'flex-end' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '220px' }}>
          <div className="form-input-wrapper" style={{ flex: 1 }}>
            <Search size={17} className="form-input-icon left" />
            <input
              id="admin-user-search"
              type="text"
              className="form-input has-prefix-icon"
              placeholder="Search by name, email or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-secondary" style={{ flexShrink: 0 }}>
            <Search size={16} /> Search
          </button>
        </form>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            id="filter-role"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="form-input"
            style={{ width: 'auto', padding: '0.65rem 1rem', cursor: 'pointer' }}
          >
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>{r === 'all' ? 'All Roles' : r.charAt(0).toUpperCase() + r.slice(1)}</option>
            ))}
          </select>

          <select
            id="filter-status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="form-input"
            style={{ width: 'auto', padding: '0.65rem 1rem', cursor: 'pointer' }}
          >
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>

          <button onClick={fetchUsers} className="btn btn-secondary btn-sm" title="Refresh">
            <RefreshCw size={15} className={loading ? 'spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } } .spin { animation: spin 0.8s linear infinite; display: inline-block; }`}</style>
          Loading users...
        </div>
      ) : users.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          <Users size={42} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
          <p>No users found matching the current filters.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table" id="admin-users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Email Verified</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => {
                const key = u._id || u.uid;
                const isProcessing = actionLoading[key];
                const registeredDate = u.createdAt
                  ? new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                  : '—';

                return (
                  <tr key={i} id={`user-row-${u.uid}`}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{u.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{u.email}</div>
                    </td>
                    <td><RoleBadge role={u.role} /></td>
                    <td><StatusBadge status={u.accountStatus || 'active'} /></td>
                    <td>
                      <span style={{ fontSize: '0.85rem', color: u.emailVerified ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
                        {u.emailVerified ? '✓ Verified' : '⏳ Pending'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      {registeredDate}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {(u.accountStatus || 'active') !== 'active' && (
                          <button
                            onClick={() => handleStatusChange(key, u.uid, 'active')}
                            className="btn btn-sm"
                            style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', fontSize: '0.75rem' }}
                            disabled={isProcessing}
                            id={`btn-activate-${u.uid}`}
                          >
                            <ShieldCheck size={13} /> Activate
                          </button>
                        )}
                        {(u.accountStatus || 'active') !== 'suspended' && u.role !== 'admin' && (
                          <button
                            onClick={() => handleStatusChange(key, u.uid, 'suspended')}
                            className="btn btn-sm"
                            style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24', fontSize: '0.75rem' }}
                            disabled={isProcessing}
                            id={`btn-suspend-${u.uid}`}
                          >
                            <ShieldOff size={13} /> Suspend
                          </button>
                        )}
                        {(u.accountStatus || 'active') !== 'blocked' && u.role !== 'admin' && (
                          <button
                            onClick={() => handleStatusChange(key, u.uid, 'blocked')}
                            className="btn btn-sm btn-danger"
                            style={{ fontSize: '0.75rem' }}
                            disabled={isProcessing}
                            id={`btn-block-${u.uid}`}
                          >
                            <Ban size={13} /> Block
                          </button>
                        )}
                        {isProcessing && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <RefreshCw size={13} className="spin" /> Processing...
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

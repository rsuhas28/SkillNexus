import React from 'react';
import { ShieldCheck, GraduationCap, Briefcase, BookOpen, Building2, AlertCircle } from 'lucide-react';

export const RoleBadge = ({ role, showIcon = true }) => {
  if (!role) return null;

  const roleConfig = {
    student: { label: 'Student', icon: GraduationCap, class: 'badge-student' },
    industry: { label: 'Industry', icon: Briefcase, class: 'badge-industry' },
    academician: { label: 'Academician', icon: BookOpen, class: 'badge-academician' },
    institution: { label: 'Institution', icon: Building2, class: 'badge-institution' },
    admin: { label: 'Platform Admin', icon: ShieldCheck, class: 'badge-admin' }
  };

  const config = roleConfig[role.toLowerCase()] || { label: role, icon: ShieldCheck, class: 'badge-secondary' };
  const Icon = config.icon;

  return (
    <span className={`badge ${config.class}`}>
      {showIcon && <Icon size={13} />}
      {config.label}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  if (!status) return null;

  const statusClass = {
    active: 'badge-active',
    pending: 'badge-pending',
    suspended: 'badge-suspended',
    blocked: 'badge-blocked'
  }[status.toLowerCase()] || 'badge-secondary';

  return (
    <span className={`badge ${statusClass}`}>
      {status === 'suspended' && <AlertCircle size={12} />}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

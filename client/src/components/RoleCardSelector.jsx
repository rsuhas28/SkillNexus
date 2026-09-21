import React from 'react';
import { GraduationCap, Briefcase, BookOpen, Building2 } from 'lucide-react';

export const rolesList = [
  {
    id: 'student',
    title: 'Student',
    description: 'Build skills, explore internships, and discover premier career opportunities.',
    icon: GraduationCap,
    accent: '#0284c7',
    iconBg: 'rgba(2, 132, 199, 0.2)'
  },
  {
    id: 'industry',
    title: 'Industry',
    description: 'Connect with verified skilled talent and post high-impact projects & jobs.',
    icon: Briefcase,
    accent: '#7c3aed',
    iconBg: 'rgba(124, 58, 237, 0.2)'
  },
  {
    id: 'academician',
    title: 'Academician',
    description: 'Connect with industry through research, FDPs, consultancy, and training.',
    icon: BookOpen,
    accent: '#059669',
    iconBg: 'rgba(5, 150, 105, 0.2)'
  },
  {
    id: 'institution',
    title: 'Institution',
    description: 'Manage talent development, placements, faculty, and industry collaboration.',
    icon: Building2,
    accent: '#d97706',
    iconBg: 'rgba(217, 119, 6, 0.2)'
  }
];

export const RoleCardSelector = ({ selectedRole, onSelectRole }) => {
  return (
    <div className="role-cards-grid" id="role-cards-grid">
      {rolesList.map((r) => {
        const Icon = r.icon;
        const isSelected = selectedRole === r.id;

        return (
          <div
            key={r.id}
            id={`role-card-${r.id}`}
            className={`role-card ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelectRole(r.id)}
            style={{
              borderColor: isSelected ? r.accent : undefined
            }}
          >
            <div
              className="role-card-icon"
              style={{
                backgroundColor: r.iconBg,
                color: r.accent
              }}
            >
              <Icon size={22} />
            </div>

            <div className="role-card-title">{r.title}</div>
            <div className="role-card-desc">{r.description}</div>
          </div>
        );
      })}
    </div>
  );
};

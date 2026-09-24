import React from 'react';
import { GraduationCap, Briefcase, BookOpen, Building2 } from 'lucide-react';

export const rolesList = [
  {
    id: 'student',
    title: 'Student',
    description: 'Discover your skills, close your gaps and find opportunities.',
    cta: 'Select Student',
    icon: GraduationCap,
    accent: '#0284c7',
    iconBg: 'rgba(2, 132, 199, 0.14)'
  },
  {
    id: 'industry',
    title: 'Industry',
    description: 'Find candidates with the skills your organization needs.',
    cta: 'Select Industry',
    icon: Briefcase,
    accent: '#7c3aed',
    iconBg: 'rgba(124, 58, 237, 0.14)'
  },
  {
    id: 'academician',
    title: 'Academician',
    description: 'Connect with industry training, FDPs, research and collaboration.',
    cta: 'Select Academician',
    icon: BookOpen,
    accent: '#059669',
    iconBg: 'rgba(5, 150, 105, 0.14)'
  },
  {
    id: 'institution',
    title: 'Institution',
    description: 'Monitor skill development, internships and placement outcomes.',
    cta: 'Select Institution',
    icon: Building2,
    accent: '#d97706',
    iconBg: 'rgba(217, 119, 6, 0.14)'
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

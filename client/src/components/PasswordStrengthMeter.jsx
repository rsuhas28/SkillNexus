import React from 'react';
import { Check, X } from 'lucide-react';

export const PasswordStrengthMeter = ({ password }) => {
  if (!password) return null;

  const checks = [
    { label: 'At least 8 characters', valid: password.length >= 8 },
    { label: 'One uppercase letter (A-Z)', valid: /[A-Z]/.test(password) },
    { label: 'One lowercase letter (a-z)', valid: /[a-z]/.test(password) },
    { label: 'One number (0-9)', valid: /[0-9]/.test(password) },
    { label: 'One special character (!@#$...)', valid: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password) }
  ];

  const passedCount = checks.filter(c => c.valid).length;

  let strengthLabel = 'Very Weak';
  let barColor = '#ef4444';
  let percentage = (passedCount / 5) * 100;

  if (passedCount === 5) {
    strengthLabel = 'Strong';
    barColor = '#10b981';
  } else if (passedCount >= 4) {
    strengthLabel = 'Good';
    barColor = '#3b82f6';
  } else if (passedCount >= 3) {
    strengthLabel = 'Medium';
    barColor = '#f59e0b';
  } else if (passedCount >= 2) {
    strengthLabel = 'Weak';
    barColor = '#f97316';
  }

  return (
    <div className="pwd-meter-container" id="password-strength-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.4rem', fontWeight: 600 }}>
        <span style={{ color: 'var(--text-secondary)' }}>Password Strength:</span>
        <span style={{ color: barColor }}>{strengthLabel}</span>
      </div>

      <div className="pwd-meter-bar-wrapper">
        <div
          className="pwd-meter-bar"
          style={{
            width: `${percentage}%`,
            backgroundColor: barColor
          }}
        />
      </div>

      <div className="pwd-checklist">
        {checks.map((check, idx) => (
          <div
            key={idx}
            className={`pwd-checklist-item ${check.valid ? 'valid' : ''}`}
          >
            {check.valid ? (
              <Check size={13} strokeWidth={2.5} color="#10b981" />
            ) : (
              <X size={13} strokeWidth={2.5} color="var(--text-muted)" />
            )}
            <span>{check.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

import React from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import { Sun, Moon, Sparkles } from 'lucide-react';

export const ThemeToggle = () => {
  const { themeMode, activeTheme, cycleTheme } = useTheme();

  const getIcon = () => {
    if (themeMode === 'auto') return <Sparkles size={15} style={{ color: '#818cf8' }} />;
    if (themeMode === 'light') return <Sun size={15} style={{ color: '#f59e0b' }} />;
    return <Moon size={15} style={{ color: '#38bdf8' }} />;
  };

  const getLabel = () => {
    if (themeMode === 'auto')
      return `Auto (${activeTheme})`;
    if (themeMode === 'light')
      return 'Light';
    return 'Dark';
  };

  return (
    <button
      onClick={cycleTheme}
      className="btn btn-secondary btn-sm"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.35rem 0.65rem',
        fontSize: '0.78rem',
        fontWeight: 600,
        borderRadius: '8px',
        transition: 'all 0.2s ease',
        cursor: 'pointer'
      }}
      title="Theme: Click to switch between Smart Auto, Dark, and Light mode"
      id="theme-toggle-btn"
    >
      {getIcon()}
      <span>{getLabel()}</span>
    </button>
  );
};

import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // 'auto' (smart automated) | 'dark' | 'light'
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('skillnexus_theme_mode') || 'auto';
  });

  const [activeTheme, setActiveTheme] = useState('dark');

  useEffect(() => {
    const computeTheme = () => {
      if (themeMode === 'light') return 'light';
      if (themeMode === 'dark') return 'dark';

      // Smart automated detection:
      // 1. Check system OS preference
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // 2. Check time of day (6 AM - 6 PM daytime -> light, 6 PM - 6 AM evening/night -> dark)
      const hour = new Date().getHours();
      const isDaytime = hour >= 6 && hour < 18;

      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').media !== 'not all') {
        // If OS has preference, follow it
        return prefersDark ? 'dark' : 'light';
      }

      // Otherwise smartly follow time of day
      return isDaytime ? 'light' : 'dark';
    };

    const current = computeTheme();
    setActiveTheme(current);
    document.documentElement.setAttribute('data-theme', current);
    localStorage.setItem('skillnexus_theme_mode', themeMode);

    // Listen for OS scheme change
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (themeMode === 'auto') {
        const updated = computeTheme();
        setActiveTheme(updated);
        document.documentElement.setAttribute('data-theme', updated);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      }
    };
  }, [themeMode]);

  const cycleTheme = () => {
    setThemeMode(prev => {
      if (prev === 'auto') return 'dark';
      if (prev === 'dark') return 'light';
      return 'auto';
    });
  };

  return (
    <ThemeContext.Provider value={{ themeMode, activeTheme, setThemeMode, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

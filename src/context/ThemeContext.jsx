import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (!saved) return false;
    
    try {
      return JSON.parse(saved);
    } catch (error) {
      // If there's an invalid value, remove it and return false
      localStorage.removeItem('theme');
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(isDark));
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = {
    isDark,
    toggleTheme,
    colors: {
      light: {
        primary: '#2563eb',
        secondary: '#1d4ed8',
        background: '#f8fafc',
        surface: '#ffffff',
        text: '#1e293b',
        textSecondary: '#64748b',
        border: '#e2e8f0',
        shadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        inputBg: '#ffffff',
        inputBorder: '#d1d5db',
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b'
      },
      dark: {
        primary: '#60a5fa',
        secondary: '#3b82f6',
        background: '#0f172a',
        surface: '#1e293b',
        text: '#f1f5f9',
        textSecondary: '#94a3b8',
        border: '#334155',
        shadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
        gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        inputBg: '#334155',
        inputBorder: '#475569',
        success: '#34d399',
        error: '#f87171',
        warning: '#fbbf24'
      }
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}; 
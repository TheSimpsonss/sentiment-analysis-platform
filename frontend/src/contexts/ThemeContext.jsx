import React, { createContext, useContext, useEffect, useState } from 'react';
import storageService from '../services/storage';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  
  useEffect(() => {
    const preferences = storageService.getPreferences();
    if (preferences && preferences.darkMode !== undefined) {
      setDarkMode(preferences.darkMode);
    } else {
      // Check user's system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);
  
  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newValue = !prev;
      const currentPrefs = storageService.getPreferences() || {};
      storageService.setPreferences({
        ...currentPrefs,
        darkMode: newValue
      });
      return newValue;
    });
  };
  
  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
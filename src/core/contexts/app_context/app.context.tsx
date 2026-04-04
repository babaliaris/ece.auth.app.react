import React, { useState, useMemo, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { eceGetTheme, type ThemeModeType } from '@/core/themes.core';
import { EceAppContext } from '@/core/contexts/app_context/app_context.type';
import { ECE_LITERALS } from '@/core/literals.core';

export const EceAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) =>
{
  const [theme_mode, setTheme] = useState<ThemeModeType>(
    localStorage.getItem(ECE_LITERALS.THEME_STORAGE_NAME) as ThemeModeType || "LIGHT"
  );

  const toggleTheme = () =>
  {
    setTheme((prev) =>
      (prev === 'LIGHT' ? 'DARK' : 'LIGHT')
    );
  };

  const setThemeMode = (newMode: ThemeModeType) =>
  {
    setTheme(newMode);
  };

  // Save the theme mode on the dist.
  useEffect(() =>
  {
    localStorage.setItem(ECE_LITERALS.THEME_STORAGE_NAME, theme_mode);
  }, [theme_mode]);

  // Select the correct MUI theme object.
  const activeTheme = useMemo(() => (eceGetTheme(theme_mode)), [theme_mode]);

  // Create the value of THIS context.
  const value = useMemo(() => (
  {
    theme_mode,
    toggleTheme,
    setThemeMode
  }), [theme_mode]);

  return (
    <EceAppContext.Provider value={value}>

      <ThemeProvider theme={activeTheme}>

        <CssBaseline/>

        {children}

      </ThemeProvider>

    </EceAppContext.Provider>
  );
};


import React from 'react';
import { AppProps } from 'next/app';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { getTheme } from '../styles/theme';

function MyApp({ Component, pageProps }: AppProps) {
  const { mode } = useTheme();
  const theme = getTheme(mode);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
    </MuiThemeProvider>
  );
}

function AppWithTheme(props: AppProps) {
  return (
    <ThemeProvider>
      <MyApp {...props} />
    </ThemeProvider>
  );
}

export default AppWithTheme;
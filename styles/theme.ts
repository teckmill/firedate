import { createTheme, ThemeOptions } from '@mui/material/styles';

const lightTheme: ThemeOptions = {
  palette: {
    primary: {
      main: '#FF4136',
    },
    secondary: {
      main: '#0074D9',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
  },
  shape: {
    borderRadius: 8,
  },
};

const darkTheme: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF6E5B',
    },
    secondary: {
      main: '#4DA8DA',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
  },
  // ... other dark theme options
};

export const getTheme = (mode: 'light' | 'dark') => 
  createTheme(mode === 'light' ? lightTheme : darkTheme);
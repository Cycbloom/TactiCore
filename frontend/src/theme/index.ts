import { createTheme, ThemeOptions } from '@mui/material';

const commonThemeOptions: ThemeOptions = {
  typography: {
    fontFamily: 'Consolas, Monaco, monospace'
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: '#6b6b6b #2b2b2b',
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            width: '8px',
            height: '8px'
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: '4px',
            backgroundColor: '#6b6b6b',
            minHeight: '24px',
            border: '2px solid #2b2b2b'
          },
          '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
            borderRadius: '4px',
            backgroundColor: '#2b2b2b'
          }
        }
      }
    }
  }
};

export const darkTheme = createTheme({
  ...commonThemeOptions,
  palette: {
    mode: 'dark',
    primary: {
      main: '#569cd6',
      light: '#9cdcfe',
      dark: '#4b89b8'
    },
    secondary: {
      main: '#ce9178',
      light: '#d4a99c',
      dark: '#b87d67'
    },
    background: {
      default: '#1e1e1e',
      paper: '#252526'
    },
    text: {
      primary: '#d4d4d4',
      secondary: '#858585'
    }
  }
});

export const lightTheme = createTheme({
  ...commonThemeOptions,
  palette: {
    mode: 'light',
    primary: {
      main: '#0078d4',
      light: '#3399ff',
      dark: '#005a9e'
    },
    secondary: {
      main: '#d83b01',
      light: '#e06234',
      dark: '#b83200'
    },
    background: {
      default: '#ffffff',
      paper: '#f3f3f3'
    },
    text: {
      primary: '#000000',
      secondary: '#666666'
    }
  }
});

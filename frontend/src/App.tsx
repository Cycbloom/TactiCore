import React from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { useState, useMemo } from 'react';
import { RouterProvider, BrowserRouter } from 'react-router-dom';

import { ErrorProvider } from './utils/error-handler';

import { AuthProvider } from '@/contexts';
import { Console, ThemeToggle } from '@/components/features';
import { darkTheme, lightTheme } from '@/theme';
import { DataProvider } from '@/data/DataContext';
import { router } from '@/routes';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = useMemo(() => (isDarkMode ? darkTheme : lightTheme), [isDarkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorProvider>
        <AuthProvider>
          <DataProvider>
            <Box sx={{ position: 'fixed', top: 16, right: 16 }}>
              <ThemeToggle onToggle={() => setIsDarkMode(!isDarkMode)} />
            </Box>
            <RouterProvider router={router} />
          </DataProvider>
        </AuthProvider>
      </ErrorProvider>
    </ThemeProvider>
  );
};

export default App;

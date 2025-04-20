import React from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { useState, useMemo } from 'react';
import { RouterProvider } from 'react-router-dom';

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
      <AuthProvider>
        <DataProvider>
          <Box sx={{ position: 'fixed', top: 16, right: 16 }}>
            <ThemeToggle onToggle={() => setIsDarkMode(!isDarkMode)} />
          </Box>
          <RouterProvider router={router} />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

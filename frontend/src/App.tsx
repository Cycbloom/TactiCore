import React from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Console, ThemeToggle } from '@/components/ui';
import { darkTheme, lightTheme } from '@/theme';
import TestTaskPage from '@/pages/TestTaskPage';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = useMemo(() => (isDarkMode ? darkTheme : lightTheme), [isDarkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ position: 'fixed', top: 16, right: 16 }}>
          <ThemeToggle onToggle={() => setIsDarkMode(!isDarkMode)} />
        </Box>
        <Routes>
          <Route path="/" />
          <Route path="/test-task" element={<TestTaskPage />} />
        </Routes>
      </Router>
      <Console />
    </ThemeProvider>
  );
};

export default App;

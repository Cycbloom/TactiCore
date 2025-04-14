import React from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import TaskListPage from './pages/TaskListPage';

import { Console, ThemeToggle } from '@/components/ui';
import { darkTheme, lightTheme } from '@/theme';
import TestTaskPage from '@/pages/TestTaskPage';
import { DataProvider } from '@/data/DataContext';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = useMemo(() => (isDarkMode ? darkTheme : lightTheme), [isDarkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DataProvider>
        <Router>
          <Box sx={{ position: 'fixed', top: 16, right: 16 }}>
            <ThemeToggle onToggle={() => setIsDarkMode(!isDarkMode)} />
          </Box>
          <Routes>
            <Route path="/" element={<Console />} />
            <Route path="/task-list" element={<TaskListPage />} />
          </Routes>
        </Router>
      </DataProvider>
    </ThemeProvider>
  );
};

export default App;

import React from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import TaskListPage from './pages/TaskListPage';

import { AuthProvider, ProtectedRoute } from '@/components/providers';
import { LoginForm, DashboardForm } from '@/components/ui';
import { Console, ThemeToggle } from '@/components/ui';
import { darkTheme, lightTheme } from '@/theme';
import { DataProvider } from '@/data/DataContext';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = useMemo(() => (isDarkMode ? darkTheme : lightTheme), [isDarkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <DataProvider>
          <Router>
            <Box sx={{ position: 'fixed', top: 16, right: 16 }}>
              <ThemeToggle onToggle={() => setIsDarkMode(!isDarkMode)} />
            </Box>
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardForm />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<LoginForm />} />
              <Route path="/task-list" element={<TaskListPage />} />
            </Routes>
          </Router>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

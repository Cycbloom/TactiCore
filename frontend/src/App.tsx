import { ThemeProvider, CssBaseline } from '@mui/material';
import { useState, useMemo } from 'react';

import { Console, ThemeToggle } from '@/components/ui';
import { darkTheme, lightTheme } from '@/theme';

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = useMemo(() => (isDarkMode ? darkTheme : lightTheme), [isDarkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ThemeToggle onToggle={() => setIsDarkMode(!isDarkMode)} />
      <Console />
    </ThemeProvider>
  );
};

export default App;

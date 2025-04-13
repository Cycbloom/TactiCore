import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

import { ConsoleOutput } from './ConsoleOutput';
import { ConsoleInput } from './ConsoleInput';
import { ConsoleTabs } from './ConsoleTabs';

import { ConsoleProvider, useConsole } from '@/components/providers';

const ConsoleContent: React.FC = () => {
  const { consoles, activeConsoleId, setInput, handleSubmit, handleKeyDown } = useConsole();
  const activeConsole = consoles.find(c => c.id === activeConsoleId);

  if (!activeConsole) return null;

  return (
    <Paper
      elevation={3}
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        bgcolor: 'background.paper',
        borderRadius: 2
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" component="div">
          控制台
        </Typography>
      </Box>
      <ConsoleTabs />
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <ConsoleOutput output={activeConsole.output} />
        <ConsoleInput
          value={activeConsole.input}
          onChange={value => setInput(activeConsoleId, value)}
          onSubmit={() => handleSubmit(activeConsoleId)}
          onKeyDown={e => handleKeyDown(activeConsoleId, e)}
        />
      </Box>
    </Paper>
  );
};

// 外部组件，提供 Context
export const Console: React.FC = () => {
  return (
    <ConsoleProvider>
      <ConsoleContent />
    </ConsoleProvider>
  );
};

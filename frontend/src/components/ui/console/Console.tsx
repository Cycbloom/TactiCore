import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

import { ConsoleOutput } from './ConsoleOutput';
import { ConsoleInput } from './ConsoleInput';

import { ConsoleProvider, useConsole } from '@/components/providers';

const ConsoleContent: React.FC = () => {
  const { output, input, setInput, handleSubmit, handleKeyDown } = useConsole();

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
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <ConsoleOutput output={output} />
        <ConsoleInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
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

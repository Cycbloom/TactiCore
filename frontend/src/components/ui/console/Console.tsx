import React from 'react';
import { Paper } from '@mui/material';

import { ConsoleOutput } from './ConsoleOutput';
import { ConsoleInput } from './ConsoleInput';

import { ConsoleProvider, useConsole } from '@/components/providers/console/ConsoleProvider';

// 内部组件，使用 useConsole
const ConsoleContent: React.FC = () => {
  const { input, output, setInput, handleSubmit, handleKeyDown } = useConsole();

  return (
    <Paper
      elevation={3}
      sx={{
        width: '100%',
        height: '100vh',
        backgroundColor: theme => (theme.palette.mode === 'dark' ? '#1e1e1e' : '#ffffff'),
        color: theme => (theme.palette.mode === 'dark' ? '#d4d4d4' : '#000000'),
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Consolas, Monaco, monospace'
      }}
    >
      <ConsoleOutput output={output} />
      <ConsoleInput
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
      />
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

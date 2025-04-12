import React, { useState } from 'react';
import { Paper } from '@mui/material';

import { ConsoleOutput } from './ConsoleOutput';
import { ConsoleInput } from './ConsoleInput';

import { CommandManager } from '@/utils/command/manager';

export const Console: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [commandManager] = useState(() => new CommandManager());

  const handleSubmit = async () => {
    if (!input.trim()) return;
    const result = await commandManager.execute(input);
    setOutput(prev => [
      ...prev,
      `> ${input}`,
      `${result.success ? 'success:' : 'error:'}${result.message} ${result.data ? `(${JSON.stringify(result.data)})` : ''}`
    ]);
    setInput('');
  };

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
      <ConsoleInput value={input} onChange={setInput} onSubmit={handleSubmit} />
    </Paper>
  );
};

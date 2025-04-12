import React from 'react';
import { Box, Typography } from '@mui/material';

interface ConsoleOutputProps {
  output: string[];
}

export const ConsoleOutput: React.FC<ConsoleOutputProps> = ({ output }) => {
  return (
    <Box
      sx={{
        flex: 1,
        overflowY: 'auto',
        marginBottom: 2,
        '&::-webkit-scrollbar': {
          width: '8px'
        },
        '&::-webkit-scrollbar-track': {
          background: theme => (theme.palette.mode === 'dark' ? '#2d2d2d' : '#f5f5f5')
        },
        '&::-webkit-scrollbar-thumb': {
          background: theme => (theme.palette.mode === 'dark' ? '#555' : '#ccc'),
          borderRadius: '4px'
        }
      }}
    >
      {output.map((line, index) => (
        <Typography
          key={index}
          variant="body2"
          sx={{
            margin: '4px 0',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            fontFamily: 'Consolas, Monaco, monospace'
          }}
        >
          {line}
        </Typography>
      ))}
    </Box>
  );
};

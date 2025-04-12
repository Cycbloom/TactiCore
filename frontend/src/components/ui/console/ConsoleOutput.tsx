import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

interface ConsoleOutputProps {
  output: string[];
}

export const ConsoleOutput: React.FC<ConsoleOutputProps> = ({ output }) => {
  const theme = useTheme();

  const getLineColor = (line: string) => {
    if (line.startsWith('>')) {
      return theme.palette.primary.main;
    }
    if (line.startsWith('success:')) {
      return theme.palette.success.main;
    }
    if (line.startsWith('error:')) {
      return theme.palette.error.main;
    }
    return theme.palette.text.primary;
  };

  const formatLine = (line: string) => {
    if (line.startsWith('success:') || line.startsWith('error:')) {
      return line.split(':').slice(1).join(':');
    }
    return line;
  };

  return (
    <Box
      sx={{
        flex: 1,
        overflow: 'auto',
        p: 2,
        backgroundColor: theme => theme.palette.background.default,
        borderRadius: 1
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
            fontFamily: 'Consolas, Monaco, monospace',
            color: getLineColor(line)
          }}
        >
          {formatLine(line)}
        </Typography>
      ))}
    </Box>
  );
};

import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

import { CommandResult } from '@/types/command';
import { LogLevel } from '@/utils/logger';

interface ConsoleOutputProps {
  output: CommandResult[];
}

export const ConsoleOutput: React.FC<ConsoleOutputProps> = ({ output }) => {
  const theme = useTheme();

  const renderOutput = (result: CommandResult) => {
    if (result.isLog) {
      const [level, message] = result.message.split(':');
      let color = theme.palette.text.primary;

      // 根据日志级别设置颜色
      switch (level) {
        case LogLevel.DEBUG:
          color = theme.palette.info.main;
          break;
        case LogLevel.INFO:
          color = theme.palette.success.main;
          break;
        case LogLevel.WARN:
          color = theme.palette.warning.main;
          break;
        case LogLevel.ERROR:
          color = theme.palette.error.main;
          break;
      }

      return (
        <Typography
          component="div"
          sx={{
            color,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}
        >
          {`[${level}] ${message}`}
        </Typography>
      );
    }

    // 非日志消息使用默认颜色
    return (
      <Typography
        component="div"
        sx={{
          color: result.success ? theme.palette.text.primary : theme.palette.error.main,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}
      >
        {result.message}
      </Typography>
    );
  };

  return (
    <Box
      sx={{
        flex: 1,
        overflow: 'auto',
        p: 2,
        bgcolor: 'theme.palette.background.paper',
        fontFamily: 'monospace',
        fontSize: '0.875rem',
        lineHeight: 1.5
      }}
    >
      {output.map((result, index) => (
        <Box key={index} sx={{ mb: 1 }}>
          {renderOutput(result)}
        </Box>
      ))}
    </Box>
  );
};

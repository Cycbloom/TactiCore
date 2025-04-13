import React from 'react';
import { Tabs, Tab, IconButton, Box, useTheme } from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';

import { useConsole } from '@/components/providers';

export const ConsoleTabs: React.FC = () => {
  const theme = useTheme();
  const { consoles, activeConsoleId, createConsole, deleteConsole, setActiveConsole } =
    useConsole();

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setActiveConsole(newValue);
  };

  const handleCloseTab = (event: React.MouseEvent, consoleId: string) => {
    event.stopPropagation();
    deleteConsole(consoleId);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', position: 'relative' }}>
      <Tabs
        value={activeConsoleId}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          minHeight: 48,
          '& .MuiTab-root': {
            minHeight: 48,
            textTransform: 'none',
            minWidth: 120,
            pr: 4
          }
        }}
      >
        {consoles.map(console => (
          <Tab
            key={console.id}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <span style={{ flex: 1 }}>{console.name}</span>
                <Box
                  onClick={e => handleCloseTab(e, console.id)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    ml: 1,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover
                    }
                  }}
                >
                  <CloseIcon sx={{ fontSize: 16 }} />
                </Box>
              </Box>
            }
            value={console.id}
          />
        ))}
      </Tabs>
      <IconButton
        onClick={createConsole}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          '&:hover': {
            backgroundColor: theme.palette.action.hover
          }
        }}
      >
        <AddIcon />
      </IconButton>
    </Box>
  );
};

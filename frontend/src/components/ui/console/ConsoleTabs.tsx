import React, { useState } from 'react';
import { Tabs, Tab, IconButton, Box, useTheme, TextField } from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';

import { useConsole } from '@/components/providers';

export const ConsoleTabs: React.FC = () => {
  const theme = useTheme();
  const {
    consoles,
    activeConsoleId,
    createConsole,
    deleteConsole,
    setActiveConsole,
    renameConsole
  } = useConsole();

  // 添加编辑状态管理
  const [editingConsoleId, setEditingConsoleId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setActiveConsole(newValue);
  };

  const handleCloseTab = (event: React.MouseEvent, consoleId: string) => {
    event.stopPropagation();
    deleteConsole(consoleId);
  };

  // 处理双击事件
  const handleDoubleClick = (event: React.MouseEvent, console: { id: string; name: string }) => {
    event.stopPropagation();
    setEditingConsoleId(console.id);
    setEditingName(console.name);
  };

  // 处理名称编辑完成
  const handleNameEditComplete = (consoleId: string) => {
    if (editingName.trim() !== '') {
      renameConsole(consoleId, editingName);
    }
    setEditingConsoleId(null);
  };

  // 处理按键事件
  const handleKeyDown = (event: React.KeyboardEvent, consoleId: string) => {
    if (event.key === 'Enter') {
      handleNameEditComplete(consoleId);
    } else if (event.key === 'Escape') {
      setEditingConsoleId(null);
    }
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', position: 'relative' }}>
      <Tabs
        value={activeConsoleId}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          minHeight: 36,
          '& .MuiTab-root': {
            minHeight: 36,
            textTransform: 'none',
            minWidth: 100,
            pr: 3,
            py: 0.5,
            fontSize: '0.875rem'
          }
        }}
      >
        {consoles.map(console => (
          <Tab
            key={console.id}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                {editingConsoleId === console.id ? (
                  <TextField
                    autoFocus
                    value={editingName}
                    onChange={e => setEditingName(e.target.value)}
                    onBlur={() => handleNameEditComplete(console.id)}
                    onKeyDown={e => handleKeyDown(e, console.id)}
                    onClick={e => e.stopPropagation()}
                    size="small"
                    sx={{
                      flex: 1,
                      width: `${editingName.length + 8}ch`,
                      '& .MuiInputBase-root': {
                        height: 24,
                        fontSize: '0.875rem'
                      }
                    }}
                  />
                ) : (
                  <span style={{ flex: 1 }} onDoubleClick={e => handleDoubleClick(e, console)}>
                    {console.name}
                  </span>
                )}
                <Box
                  onClick={e => handleCloseTab(e, console.id)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    ml: 0.5,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover
                    }
                  }}
                >
                  <CloseIcon sx={{ fontSize: 14 }} />
                </Box>
              </Box>
            }
            value={console.id}
          />
        ))}
      </Tabs>
      <IconButton
        onClick={createConsole}
        size="small"
        sx={{
          position: 'absolute',
          right: 4,
          top: 4,
          '&:hover': {
            backgroundColor: theme.palette.action.hover
          }
        }}
      >
        <AddIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

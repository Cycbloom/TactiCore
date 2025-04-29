import React, { useState } from 'react';
import {
  Button,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Box,
  Tooltip,
  Paper,
  Typography,
  Collapse,
  IconButton
} from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';

import TaskFilter from './TaskFilter';

import { FilterFormData } from '@/types/task';
import { useHistoryStore } from '@/store/historyStore';

interface TaskHeaderProps {
  filters: FilterFormData;
  onFilterChange: (filters: FilterFormData) => void;
  onCreateClick: () => void;
  viewMode: 'list' | 'mindmap';
  onViewModeChange: (viewMode: 'list' | 'mindmap') => void;
  onUndo: () => void;
  onRedo: () => void;
}

const TaskHeader: React.FC<TaskHeaderProps> = ({
  filters,
  onFilterChange,
  onCreateClick,
  viewMode,
  onViewModeChange,
  onUndo,
  onRedo
}) => {
  const [expanded, setExpanded] = useState(true);
  const { canUndo, canRedo } = useHistoryStore();

  const handleViewModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newViewMode: 'list' | 'mindmap'
  ) => {
    if (newViewMode !== null) {
      onViewModeChange(newViewMode);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2
      }}
    >
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => setExpanded(!expanded)} size="small" sx={{ mr: 1 }}>
              {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
            <Typography variant="h6" component="h2">
              任务列表
            </Typography>
          </Box>
          <Stack direction="row" spacing={2} alignItems="center">
            <Tooltip title="撤销">
              <span>
                <IconButton
                  onClick={onUndo}
                  disabled={!canUndo}
                  size="small"
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:disabled': {
                      opacity: 0.5
                    }
                  }}
                >
                  <UndoIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="重做">
              <span>
                <IconButton
                  onClick={onRedo}
                  disabled={!canRedo}
                  size="small"
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:disabled': {
                      opacity: 0.5
                    }
                  }}
                >
                  <RedoIcon />
                </IconButton>
              </span>
            </Tooltip>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              aria-label="视图模式"
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  border: '1px solid',
                  borderColor: 'divider',
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark'
                    }
                  }
                }
              }}
            >
              <Tooltip title="列表视图">
                <ToggleButton value="list" aria-label="列表视图">
                  <ViewListIcon />
                </ToggleButton>
              </Tooltip>
              <Tooltip title="思维导图视图">
                <ToggleButton value="mindmap" aria-label="思维导图视图">
                  <AccountTreeIcon />
                </ToggleButton>
              </Tooltip>
            </ToggleButtonGroup>
            <Button
              variant="contained"
              onClick={onCreateClick}
              startIcon={<AddIcon />}
              sx={{
                minWidth: 120,
                boxShadow: 2,
                '&:hover': {
                  boxShadow: 4
                }
              }}
            >
              创建任务
            </Button>
          </Stack>
        </Box>
        <Collapse in={expanded}>
          <TaskFilter filters={filters} onFilterChange={onFilterChange} />
        </Collapse>
      </Box>
    </Paper>
  );
};

TaskHeader.displayName = 'TaskHeader';

export default TaskHeader;

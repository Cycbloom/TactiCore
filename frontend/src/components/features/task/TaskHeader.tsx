import React from 'react';
import {
  Button,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Box,
  Tooltip,
  Paper,
  Typography
} from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AddIcon from '@mui/icons-material/Add';

import TaskFilter from './TaskFilter';

import { FilterFormData } from '@/types/task';

interface TaskHeaderProps {
  filters: FilterFormData;
  onFilterChange: (filters: FilterFormData) => void;
  onCreateClick: () => void;
  viewMode: 'list' | 'mindmap';
  onViewModeChange: (viewMode: 'list' | 'mindmap') => void;
}

const TaskHeader: React.FC<TaskHeaderProps> = ({
  filters,
  onFilterChange,
  onCreateClick,
  viewMode,
  onViewModeChange
}) => {
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
          <Typography variant="h6" component="h2">
            任务列表
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
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
        <TaskFilter filters={filters} onFilterChange={onFilterChange} />
      </Box>
    </Paper>
  );
};

TaskHeader.displayName = 'TaskHeader';

export default TaskHeader;

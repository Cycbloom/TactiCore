import React from 'react';
import { Box, Button, Stack } from '@mui/material';

import TaskFilter from './TaskFilter';

import { FilterFormData } from '@/types/task';

interface TaskListHeaderProps {
  filters: FilterFormData;
  onFilterChange: (filters: FilterFormData) => void;
  onCreateClick: () => void;
}

const TaskListHeader: React.FC<TaskListHeaderProps> = ({
  filters,
  onFilterChange,
  onCreateClick
}) => {
  return (
    <Stack spacing={2} sx={{ mb: 3 }}>
      <TaskFilter filters={filters} onFilterChange={onFilterChange} />
      <Button variant="contained" onClick={onCreateClick}>
        创建任务
      </Button>
    </Stack>
  );
};

TaskListHeader.displayName = 'TaskListHeader';

export default TaskListHeader;

import React from 'react';
import { Button, Stack } from '@mui/material';

import TaskFilter from './TaskFilter';

import { FilterFormData } from '@/types/task';

interface TaskHeaderProps {
  filters: FilterFormData;
  onFilterChange: (filters: FilterFormData) => void;
  onCreateClick: () => void;
}

const TaskHeader: React.FC<TaskHeaderProps> = ({ filters, onFilterChange, onCreateClick }) => {
  return (
    <Stack spacing={2} sx={{ mb: 3 }}>
      <TaskFilter filters={filters} onFilterChange={onFilterChange} />
      <Button variant="contained" onClick={onCreateClick}>
        创建任务
      </Button>
    </Stack>
  );
};

TaskHeader.displayName = 'TaskHeader';

export default TaskHeader;

import React, { useState } from 'react';
import { Box, Dialog } from '@mui/material';

import TaskListHeader from './TaskListHeader';
import TaskListContent from './TaskListContent';
import TaskForm from './TaskForm';

import { Task, FilterFormData, TaskFormData } from '@/types/task';

interface TaskListProps {
  tasks: Task[];
  filters: FilterFormData;
  onFilterChange: (filters: FilterFormData) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleStatus: (taskId: string) => void;
  onCreateTask: (task: TaskFormData) => void;
}

const TaskList: React.FC<TaskListProps> = React.memo(
  ({ tasks, filters, onFilterChange, onEditTask, onDeleteTask, onToggleStatus, onCreateTask }) => {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    return (
      <Box>
        <TaskListHeader
          filters={filters}
          onFilterChange={onFilterChange}
          onCreateClick={() => setIsCreateDialogOpen(true)}
        />

        <TaskListContent
          tasks={tasks}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onToggleStatus={onToggleStatus}
        />

        <Dialog
          open={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <Box sx={{ p: 3 }}>
            <TaskForm onSubmit={onCreateTask} onCancel={() => setIsCreateDialogOpen(false)} />
          </Box>
        </Dialog>
      </Box>
    );
  }
);

TaskList.displayName = 'TaskList';

export default TaskList;

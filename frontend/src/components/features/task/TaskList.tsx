import React, { useState } from 'react';
import { Box, Stack } from '@mui/material';

import TaskCard from './TaskCard';
import TaskFilter from './TaskFilter';

import { Task } from '@/types/task';

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleStatus: (taskId: string) => void;
}

type FilterFormData = {
  searchTerm: string;
  statusFilter: 'all' | 'todo' | 'inProgress' | 'completed';
  priorityFilter: 'all' | 'high' | 'medium' | 'low';
};

const TaskList: React.FC<TaskListProps> = ({ tasks, onEditTask, onDeleteTask, onToggleStatus }) => {
  const [filters, setFilters] = useState<FilterFormData>({
    searchTerm: '',
    statusFilter: 'all',
    priorityFilter: 'all'
  });

  const filteredTasks = tasks.filter((task: Task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(filters.searchTerm.toLowerCase());
    const matchesStatus = filters.statusFilter === 'all' || task.status === filters.statusFilter;
    const matchesPriority =
      filters.priorityFilter === 'all' || task.priority === filters.priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <Box>
      <Stack spacing={2} sx={{ mb: 3 }}>
        <TaskFilter onFilterChange={setFilters} />
      </Stack>

      <Stack spacing={2}>
        {filteredTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={() => onEditTask(task)}
            onDelete={() => onDeleteTask(task.id)}
            onStatusChange={() => onToggleStatus(task.id)}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default TaskList;

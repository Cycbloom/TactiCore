import React from 'react';
import { Stack } from '@mui/material';

import TaskCard from './TaskCard';

import { Task } from '@/types/task';

interface TaskListContentProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleStatus: (taskId: string) => void;
}

const TaskListContent: React.FC<TaskListContentProps> = ({
  tasks,
  onEditTask,
  onDeleteTask,
  onToggleStatus
}) => {
  return (
    <Stack spacing={2}>
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={() => onEditTask(task)}
          onDelete={() => onDeleteTask(task.id)}
          onStatusChange={() => onToggleStatus(task.id)}
        />
      ))}
    </Stack>
  );
};

TaskListContent.displayName = 'TaskListContent';

export default TaskListContent;

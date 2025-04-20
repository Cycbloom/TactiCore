import React from 'react';
import { Stack } from '@mui/material';

import TaskCard from './TaskCard';

import { Task, TaskStatus } from '@/types/task';

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleStatus: (taskId: string, status: TaskStatus) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEditTask, onDeleteTask, onToggleStatus }) => {
  return (
    <Stack spacing={2}>
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={task => {
            console.log('TaskListContent: onEdit called with task:', task);
            onEditTask(task);
          }}
          onDelete={onDeleteTask}
          onStatusChange={onToggleStatus}
        />
      ))}
    </Stack>
  );
};

TaskList.displayName = 'TaskList';

export default TaskList;

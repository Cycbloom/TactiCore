import React from 'react';
import { Stack } from '@mui/material';

import TaskCard from './TaskCard';

import { Task, TaskStatus } from '@/types/task';

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskPath: string[]) => void;
  onToggleStatus: (taskId: string) => void;
  onAddSubtask: (parentId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onEditTask,
  onDeleteTask,
  onToggleStatus,
  onAddSubtask
}) => {
  return (
    <Stack spacing={2}>
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={task => {
            onEditTask(task);
          }}
          onDelete={onDeleteTask}
          onStatusChange={onToggleStatus}
          onAddSubtask={onAddSubtask}
        />
      ))}
    </Stack>
  );
};

TaskList.displayName = 'TaskList';

export default TaskList;

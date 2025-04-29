import React, { useRef } from 'react';
import { Stack, Box } from '@mui/material';
import { useDrop } from 'react-dnd';

import TaskCard from './TaskCard/TaskCard';

import { Task, TaskStatus } from '@/types/task';

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskPath: string[]) => void;
  onToggleStatus: (taskPath: string[], newStatus: TaskStatus) => void;
  onAddSubtask: (parentId: string) => void;
  onMoveTask: (taskPath: string[], newTaskPath: string[]) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onEditTask,
  onDeleteTask,
  onToggleStatus,
  onAddSubtask,
  onMoveTask
}) => {
  const dropRef = useRef<HTMLDivElement>(null);

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'TASK',
    drop: (item: { path: string[] }, monitor) => {
      if (!monitor.isOver({ shallow: true })) {
        return;
      }
      // 当拖拽到列表顶部时，移动到根目录
      onMoveTask(item.path, []);
    },
    canDrop: (item: { path: string[] }) => {
      // 如果已经是根任务，则不能放置
      if (item.path.length === 0) return false;
      return true;
    },
    collect: monitor => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop()
    })
  }));

  drop(dropRef);

  return (
    <Stack spacing={2}>
      <Box
        ref={dropRef}
        sx={{
          height: '4px',
          backgroundColor: isOver && canDrop ? 'primary.main' : 'transparent',
          borderRadius: '2px',
          transition: 'background-color 0.2s'
        }}
      />
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
          onMoveTask={onMoveTask}
        />
      ))}
    </Stack>
  );
};

TaskList.displayName = 'TaskList';

export default TaskList;

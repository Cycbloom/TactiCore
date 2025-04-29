import { useMemo } from 'react';

import { Task, TaskStatus, TaskPriority } from '@/types/task';

interface UseNodeStylesProps {
  task: Task;
}

export const useNodeStyles = ({ task }: UseNodeStylesProps) => {
  const styles = useMemo(() => {
    // 状态颜色映射
    const statusColors: Record<TaskStatus, string> = {
      [TaskStatus.TODO]: '#ff9800',
      [TaskStatus.IN_PROGRESS]: '#2196f3',
      [TaskStatus.COMPLETED]: '#4caf50'
    };

    // 优先级颜色映射
    const priorityColors: Record<TaskPriority, string> = {
      [TaskPriority.MINIMAL]: '#9e9e9e',
      [TaskPriority.LOW]: '#4caf50',
      [TaskPriority.MEDIUM]: '#ff9800',
      [TaskPriority.HIGH]: '#f44336',
      [TaskPriority.URGENT]: '#f44336'
    };

    // 获取节点背景色
    const getNodeBackgroundColor = () => {
      switch (task.status) {
        case TaskStatus.TODO:
          return 'rgba(255, 152, 0, 0.1)';
        case TaskStatus.IN_PROGRESS:
          return 'rgba(33, 150, 243, 0.1)';
        case TaskStatus.COMPLETED:
          return 'rgba(76, 175, 80, 0.1)';
        default:
          return 'background.paper';
      }
    };

    return {
      card: {
        minWidth: 200,
        maxWidth: 300,
        boxShadow: 2,
        backgroundColor: getNodeBackgroundColor(),
        border: '1px solid',
        borderColor: statusColors[task.status],
        position: 'relative',
        '&:hover': {
          boxShadow: 4,
          cursor: 'pointer'
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: 4,
          height: '100%',
          backgroundColor: priorityColors[task.priority],
          borderTopLeftRadius: 4,
          borderBottomLeftRadius: 4
        }
      }
    };
  }, [task]);

  return styles;
};

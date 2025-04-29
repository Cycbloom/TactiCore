import React from 'react';
import { Stack, Chip, Tooltip } from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  Flag as FlagIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

import { Task, TaskPriority } from '@/types/task';

interface TaskCardChipsProps {
  task: Task;
}

const TaskCardChips: React.FC<TaskCardChipsProps> = ({ task }) => {
  // 优先级颜色映射
  const priorityColors = {
    [TaskPriority.URGENT]: 'error',
    [TaskPriority.HIGH]: 'warning',
    [TaskPriority.MEDIUM]: 'info',
    [TaskPriority.LOW]: 'success',
    [TaskPriority.MINIMAL]: 'default'
  } as const;

  // 优先级标签映射
  const priorityLabels = {
    [TaskPriority.URGENT]: '紧急',
    [TaskPriority.HIGH]: '高',
    [TaskPriority.MEDIUM]: '中',
    [TaskPriority.LOW]: '低',
    [TaskPriority.MINIMAL]: '最低'
  };

  // 计算剩余时间
  const getRemainingTime = () => {
    if (!task.dueDate) return null;
    const now = new Date();
    const dueDate = new Date(task.dueDate);
    const hours = Math.max(0, (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60));

    if (hours < 24) {
      return `${Math.round(hours)}小时`;
    } else if (hours < 168) {
      return `${Math.round(hours / 24)}天`;
    } else {
      return `${Math.round(hours / 168)}周`;
    }
  };

  // 计算进度
  const getProgress = () => {
    if (!task.estimatedHours || !task.actualHours) return null;
    const progress = (task.actualHours / task.estimatedHours) * 100;
    return `${Math.round(progress)}%`;
  };

  return (
    <Stack direction="row" spacing={1}>
      <Tooltip title={`优先级分数: ${task.priorityScore}`}>
        <Chip
          icon={<FlagIcon />}
          label={priorityLabels[task.priority]}
          color={priorityColors[task.priority]}
          size="small"
        />
      </Tooltip>

      {task.dueDate && (
        <Tooltip title="截止时间">
          <Chip
            icon={<AccessTimeIcon />}
            label={getRemainingTime()}
            color={task.priority === TaskPriority.URGENT ? 'error' : 'default'}
            size="small"
          />
        </Tooltip>
      )}

      {task.estimatedHours && task.actualHours && (
        <Tooltip title="完成进度">
          <Chip
            icon={<WarningIcon />}
            label={getProgress()}
            color={task.actualHours > task.estimatedHours ? 'error' : 'default'}
            size="small"
          />
        </Tooltip>
      )}

      {task.isBlocked && <Chip label="被阻塞" color="error" size="small" />}
    </Stack>
  );
};

export default TaskCardChips;

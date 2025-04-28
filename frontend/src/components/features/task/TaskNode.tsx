import React from 'react';
import { Handle, Position } from 'reactflow';
import { Card, CardContent, Typography, Box, IconButton, Chip, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import { Task, TaskStatus } from '@/types/task';

interface TaskNodeProps {
  data: {
    label: string;
    task: Task;
    onEdit: () => void;
    onDelete: () => void;
    onToggleStatus: (status: TaskStatus) => void;
    onAddSubtask: () => void;
    level: number;
  };
}

const TaskNode: React.FC<TaskNodeProps> = ({ data }) => {
  const { label, task, onEdit, onDelete, onToggleStatus, onAddSubtask, level } = data;

  // 状态颜色映射
  const statusColors: Record<TaskStatus, string> = {
    [TaskStatus.TODO]: '#ff9800',
    [TaskStatus.IN_PROGRESS]: '#2196f3',
    [TaskStatus.COMPLETED]: '#4caf50'
    // [TaskStatus.BLOCKED]: '#f44336'
  };

  return (
    <Card
      sx={{
        minWidth: 200,
        maxWidth: 300,
        boxShadow: 2,
        '&:hover': {
          boxShadow: 4
        }
      }}
    >
      <Handle type="target" position={Position.Left} />

      <CardContent>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}
        >
          <Typography variant="h6" component="div" sx={{ wordBreak: 'break-word' }}>
            {label}
          </Typography>
          <Box>
            <Tooltip title="添加子任务">
              <span>
                <IconButton
                  size="small"
                  onClick={onAddSubtask}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="编辑任务">
              <IconButton size="small" onClick={onEdit}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="删除任务">
              <IconButton size="small" onClick={onDelete}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Chip
            label={task.status}
            size="small"
            sx={{
              backgroundColor: statusColors[task.status],
              color: 'white',
              width: 'fit-content'
            }}
          />

          {task.description && (
            <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
              {task.description}
            </Typography>
          )}

          {task.dueDate && (
            <Typography variant="caption" color="text.secondary">
              截止日期: {new Date(task.dueDate).toLocaleDateString()}
            </Typography>
          )}

          {task.children && task.children.length > 0 && (
            <Typography variant="caption" color="text.secondary">
              子任务: {task.children.length} 个
            </Typography>
          )}
        </Box>
      </CardContent>

      <Handle type="source" position={Position.Right} />
    </Card>
  );
};

export default TaskNode;

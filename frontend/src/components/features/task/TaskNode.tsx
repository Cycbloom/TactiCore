import React from 'react';
import { Handle, Position } from 'reactflow';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Tooltip,
  Stack
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import FlagIcon from '@mui/icons-material/Flag';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import { Task, TaskStatus, TaskPriority } from '@/types/task';

interface TaskNodeProps {
  data: {
    label: string;
    task: Task;
    onEdit: () => void;
    onDelete: () => void;
    onToggleStatus: (status: TaskStatus) => void;
    onAddSubtask: () => void;
    onToggleCollapse: () => void;
    isCollapsed: boolean;
    hasChildren: boolean;
    level: number;
  };
}

const TaskNode: React.FC<TaskNodeProps> = ({ data }) => {
  const {
    label,
    task,
    onEdit,
    onDelete,
    onToggleStatus,
    onAddSubtask,
    onToggleCollapse,
    isCollapsed,
    hasChildren,
    level
  } = data;

  // 状态颜色映射
  const statusColors: Record<TaskStatus, string> = {
    [TaskStatus.TODO]: '#ff9800',
    [TaskStatus.IN_PROGRESS]: '#2196f3',
    [TaskStatus.COMPLETED]: '#4caf50'
    // [TaskStatus.BLOCKED]: '#f44336'
  };

  // 优先级颜色映射
  const priorityColors: Record<TaskPriority, string> = {
    [TaskPriority.HIGH]: '#f44336',
    [TaskPriority.MEDIUM]: '#ff9800',
    [TaskPriority.LOW]: '#4caf50'
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

  return (
    <Card
      sx={{
        minWidth: 200,
        maxWidth: 300,
        boxShadow: 2,
        backgroundColor: getNodeBackgroundColor(),
        border: '1px solid',
        borderColor: statusColors[task.status],
        position: 'relative',
        '&:hover': {
          boxShadow: 4
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
            {hasChildren && (
              <Tooltip title={isCollapsed ? '展开' : '折叠'}>
                <IconButton
                  size="small"
                  onClick={onToggleCollapse}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  {isCollapsed ? (
                    <ExpandMoreIcon fontSize="small" />
                  ) : (
                    <ExpandLessIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            )}
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

        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          <Chip
            label={task.status}
            size="small"
            sx={{
              backgroundColor: statusColors[task.status],
              color: 'white',
              width: 'fit-content'
            }}
          />
          <Tooltip title={`优先级: ${task.priority}`}>
            <Chip
              icon={<FlagIcon />}
              label={task.priority}
              size="small"
              sx={{
                backgroundColor: priorityColors[task.priority],
                color: 'white',
                width: 'fit-content'
              }}
            />
          </Tooltip>
        </Stack>

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
      </CardContent>

      <Handle type="source" position={Position.Right} />
    </Card>
  );
};

export default TaskNode;

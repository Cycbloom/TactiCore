import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Box,
  Stack,
  Collapse,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  AccountTree as AccountTreeIcon
} from '@mui/icons-material';

import { Task, TaskStatus, TaskPriority } from '@/types/task';

export interface TaskProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskPath: string[]) => void;
  onStatusChange?: (id: string, newStatus: TaskStatus) => void;
  onAddSubtask?: (parentId: string) => void;
  level?: number;
}

const TaskCard: React.FC<TaskProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  onAddSubtask,
  level = 0
}) => {
  const [expanded, setExpanded] = useState(false);

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'inProgress':
        return 'info';
      case 'todo':
        return 'default';
    }
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ mb: 2, ml: level * 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            {task.children && task.children.length > 0 && (
              <IconButton size="small" onClick={handleExpandClick}>
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            )}
            <Typography variant="h6" component="div">
              {task.title}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <IconButton
              size="small"
              onClick={() => {
                const newStatus = task.status === 'completed' ? 'todo' : 'completed';
                onStatusChange?.(task.id, newStatus as TaskStatus);
              }}
            >
              <CheckCircleIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => {
                onEdit?.(task);
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => {
                onDelete?.(task.path);
              }}
            >
              <DeleteIcon />
            </IconButton>
            {level < 2 && (
              <IconButton
                size="small"
                onClick={() => {
                  onAddSubtask?.(task.id);
                }}
              >
                <AddIcon />
              </IconButton>
            )}
          </Stack>
        </Box>

        {task.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {task.description}
          </Typography>
        )}

        <Box sx={{ mt: 2 }}>
          <Stack direction="row" spacing={1}>
            <Chip label={task.status} color={getStatusColor(task.status)} size="small" />
            <Chip label={task.priority} color={getPriorityColor(task.priority)} size="small" />
            {task.dueDate && (
              <Chip
                label={new Date(task.dueDate).toLocaleDateString()}
                variant="outlined"
                size="small"
              />
            )}
          </Stack>
        </Box>

        {task.tags && task.tags.length > 0 && (
          <Box sx={{ mt: 1 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {task.tags.map(tag => (
                <Chip key={tag} label={tag} size="small" variant="outlined" />
              ))}
            </Stack>
          </Box>
        )}

        {task.path && task.path.length > 0 && (
          <Box sx={{ mt: 1 }}>
            <Tooltip title="任务路径">
              <Stack direction="row" spacing={1} alignItems="center">
                <AccountTreeIcon fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary">
                  {task.path.join(' > ')}
                </Typography>
              </Stack>
            </Tooltip>
          </Box>
        )}

        {task.children && task.children.length > 0 && (
          <Collapse in={expanded}>
            <Box sx={{ mt: 2 }}>
              {task.children.map(child => (
                <TaskCard
                  key={child.id}
                  task={child}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                  onAddSubtask={onAddSubtask}
                  level={level + 1}
                />
              ))}
            </Box>
          </Collapse>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCard;

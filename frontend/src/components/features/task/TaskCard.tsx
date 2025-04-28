import React, { useState, useRef } from 'react';
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
  AccountTree as AccountTreeIcon,
  DragIndicator as DragIndicatorIcon
} from '@mui/icons-material';
import { useDrag, useDrop } from 'react-dnd';

import { Task, TaskStatus, TaskPriority } from '@/types/task';

export interface TaskProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskPath: string[]) => void;
  onStatusChange?: (id: string, newStatus: TaskStatus) => void;
  onAddSubtask?: (parentId: string) => void;
  onMoveTask?: (taskPath: string[], newTaskPath: string[]) => void;
  level?: number;
}

const TaskCard: React.FC<TaskProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  onAddSubtask,
  onMoveTask,
  level = 0
}) => {
  const [expanded, setExpanded] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: { path: task.path, type: 'TASK' },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  }));

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'TASK',
    drop: (item: { path: string[] }, monitor) => {
      if (!monitor.isOver({ shallow: true })) {
        return;
      }
      if (item.path !== task.path) {
        onMoveTask?.(item.path, task.path);
      }
    },
    canDrop: (item: { path: string[] }) => {
      // 不能拖拽到自身
      if (item.path === task.path) return false;
      // 不能拖拽到子任务中
      if (task.path.includes(item.path[item.path.length - 1])) return false;
      return true;
    },
    collect: monitor => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop()
    })
  }));

  drag(dragRef);
  drop(dropRef);

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
    <Card
      ref={dropRef}
      sx={{
        mb: 2,
        ml: level * 2,
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: isOver && canDrop ? 'action.hover' : 'background.paper',
        position: 'relative',
        '&::before':
          isOver && canDrop
            ? {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                border: '2px dashed',
                borderColor: 'primary.main',
                borderRadius: 1,
                pointerEvents: 'none'
              }
            : {}
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <Box
              ref={dragRef}
              sx={{
                cursor: 'move',
                display: 'flex',
                alignItems: 'center',
                mr: 1
              }}
            >
              <DragIndicatorIcon
                sx={{
                  color: 'action.active'
                }}
              />
            </Box>
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
            <IconButton
              size="small"
              onClick={() => {
                onAddSubtask?.(task.id);
              }}
            >
              <AddIcon />
            </IconButton>
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
                  onMoveTask={onMoveTask}
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

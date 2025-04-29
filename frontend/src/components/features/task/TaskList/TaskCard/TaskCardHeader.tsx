import React from 'react';
import { Box, Typography, IconButton, Stack, Tooltip } from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  DragIndicator as DragIndicatorIcon
} from '@mui/icons-material';

import { Task, TaskStatus } from '@/types/task';

interface TaskCardHeaderProps {
  task: Task;
  isDragging: boolean;
  dragRef: React.RefObject<HTMLDivElement | null>;
  expanded: boolean;
  onExpandClick: () => void;
  onEdit: (task: Task) => void;
  onDelete: (taskPath: string[]) => void;
  onStatusChange: (taskPath: string[], newStatus: TaskStatus) => void;
  onAddSubtask: (parentId: string) => void;
}

const TaskCardHeader: React.FC<TaskCardHeaderProps> = ({
  task,
  isDragging,
  dragRef,
  expanded,
  onExpandClick,
  onEdit,
  onDelete,
  onStatusChange,
  onAddSubtask
}) => {
  return (
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
          <IconButton size="small" onClick={onExpandClick}>
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
            onStatusChange(task.path, newStatus as TaskStatus);
          }}
        >
          <CheckCircleIcon />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => {
            onEdit(task);
          }}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => {
            onDelete(task.path);
          }}
        >
          <DeleteIcon />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => {
            onAddSubtask(task.id);
          }}
        >
          <AddIcon />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default TaskCardHeader;

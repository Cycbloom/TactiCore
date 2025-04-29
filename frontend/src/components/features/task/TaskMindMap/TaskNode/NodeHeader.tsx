import React from 'react';
import { Box, Typography, IconButton, Stack, Tooltip } from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';

import { Task } from '@/types/task';

interface NodeHeaderProps {
  task: Task;
  hasChildren: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddSubtask: () => void;
}

const NodeHeader: React.FC<NodeHeaderProps> = ({
  task,
  hasChildren,
  isCollapsed,
  onToggleCollapse,
  onEdit,
  onDelete,
  onAddSubtask
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        mb: 1
      }}
    >
      <Box display="flex" alignItems="center">
        {hasChildren && (
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
        )}
        <Typography variant="h6" component="div" sx={{ wordBreak: 'break-word' }}>
          {task.title}
        </Typography>
      </Box>
      <Stack direction="row" spacing={1}>
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
      </Stack>
    </Box>
  );
};

export default NodeHeader;

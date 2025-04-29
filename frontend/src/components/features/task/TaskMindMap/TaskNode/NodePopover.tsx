import React from 'react';
import { Popover, Paper, Stack, Typography, Box, Divider } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

import NodeContent from './NodeContent';

import { Task } from '@/types/task';

interface NodePopoverProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  task: Task;
}

const NodePopover: React.FC<NodePopoverProps> = ({ open, anchorEl, onClose, task }) => {
  return (
    <Popover
      sx={{
        pointerEvents: 'none'
      }}
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left'
      }}
      onClose={onClose}
      disableRestoreFocus
    >
      <Paper sx={{ p: 2, maxWidth: 400 }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h6" gutterBottom>
              {task.title}
            </Typography>
            <NodeContent task={task} />
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              <InfoIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              任务信息
            </Typography>
            <Typography variant="body2">
              创建时间: {new Date(task.createdAt).toLocaleString()}
            </Typography>
            {task.updatedAt && (
              <Typography variant="body2">
                更新时间: {new Date(task.updatedAt).toLocaleString()}
              </Typography>
            )}
          </Box>
        </Stack>
      </Paper>
    </Popover>
  );
};

export default NodePopover;

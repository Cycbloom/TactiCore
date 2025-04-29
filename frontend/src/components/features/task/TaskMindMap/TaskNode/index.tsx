import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Card, CardContent } from '@mui/material';

import NodeHeader from './NodeHeader';
import NodeContent from './NodeContent';
import NodePopover from './NodePopover';
import { useNodeStyles } from './useNodeStyles';

import { Task, TaskStatus } from '@/types/task';

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
    hasChildren
  } = data;

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const styles = useNodeStyles({ task });

  return (
    <>
      <Card sx={styles.card} onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}>
        <Handle type="target" position={Position.Left} />

        <CardContent>
          <NodeHeader
            task={task}
            hasChildren={hasChildren}
            isCollapsed={isCollapsed}
            onToggleCollapse={onToggleCollapse}
            onEdit={onEdit}
            onDelete={onDelete}
            onAddSubtask={onAddSubtask}
          />

          <NodeContent task={task} />
        </CardContent>

        <Handle type="source" position={Position.Right} />
      </Card>

      <NodePopover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        task={task}
      />
    </>
  );
};

export default TaskNode;

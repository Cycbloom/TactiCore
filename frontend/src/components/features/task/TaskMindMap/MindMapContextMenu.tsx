import React from 'react';
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface MindMapContextMenuProps {
  open: boolean;
  anchorPosition: { top: number; left: number } | undefined;
  onClose: () => void;
  onAddSubtask: () => void;
  onEditTask: () => void;
  onDeleteTask: () => void;
}

const MindMapContextMenu: React.FC<MindMapContextMenuProps> = ({
  open,
  anchorPosition,
  onClose,
  onAddSubtask,
  onEditTask,
  onDeleteTask
}) => {
  return (
    <Menu
      open={open}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition}
    >
      <MenuItem onClick={onAddSubtask}>
        <ListItemIcon>
          <AddIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>添加子任务</ListItemText>
      </MenuItem>
      <MenuItem onClick={onEditTask}>
        <ListItemIcon>
          <EditIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>编辑任务</ListItemText>
      </MenuItem>
      <MenuItem onClick={onDeleteTask}>
        <ListItemIcon>
          <DeleteIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>删除任务</ListItemText>
      </MenuItem>
    </Menu>
  );
};

export default MindMapContextMenu;

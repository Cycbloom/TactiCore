import React from 'react';
import { Box, TextField, IconButton, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

interface MindMapControlsProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  onAutoLayout: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
}

const MindMapControls: React.FC<MindMapControlsProps> = ({
  searchQuery,
  onSearch,
  onAutoLayout,
  onZoomIn,
  onZoomOut,
  onFitView
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
      <TextField
        size="small"
        placeholder="搜索任务..."
        value={searchQuery}
        onChange={e => onSearch(e.target.value)}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
        }}
      />
      <Tooltip title="自动布局">
        <IconButton onClick={onAutoLayout}>
          <AccountTreeIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="放大">
        <IconButton onClick={onZoomIn}>
          <ZoomInIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="缩小">
        <IconButton onClick={onZoomOut}>
          <ZoomOutIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="适应视图">
        <IconButton onClick={onFitView}>
          <CenterFocusStrongIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default MindMapControls;

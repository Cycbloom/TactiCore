import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box } from '@mui/material';
import { DragHandle as DragHandleIcon } from '@mui/icons-material';

interface ResizableContainerProps {
  children: React.ReactNode;
  minHeight?: number;
  maxHeight?: number;
  initialHeight?: number;
  position?: 'top' | 'bottom';
}

export const ResizableContainer: React.FC<ResizableContainerProps> = ({
  children,
  minHeight = 200,
  maxHeight = 600,
  initialHeight = 300,
  position = 'bottom'
}) => {
  const [height, setHeight] = useState(initialHeight);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartY.current = e.clientY;
    dragStartHeight.current = height;
    document.body.style.cursor = 'row-resize';
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const delta =
        position === 'bottom' ? dragStartY.current - e.clientY : e.clientY - dragStartY.current;

      const newHeight = Math.min(Math.max(dragStartHeight.current + delta, minHeight), maxHeight);
      setHeight(newHeight);
    },
    [isDragging, minHeight, maxHeight, position]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = '';
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <Box
      sx={{
        position: 'fixed',
        [position]: 0,
        left: 0,
        right: 0,
        height: `${height}px`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        bgcolor: 'background.paper',
        borderRadius: position === 'bottom' ? '8px 8px 0 0' : '0 0 8px 8px',
        zIndex: 1000,
        boxShadow: 3
      }}
    >
      <Box
        onMouseDown={handleMouseDown}
        sx={{
          height: '8px',
          width: '100%',
          cursor: 'row-resize',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': {
            backgroundColor: 'action.hover'
          }
        }}
      >
        <DragHandleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
      </Box>
      <Box sx={{ flex: 1, overflow: 'hidden' }}>{children}</Box>
    </Box>
  );
};

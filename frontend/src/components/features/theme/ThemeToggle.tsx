import { IconButton, Tooltip, useTheme, Box } from '@mui/material';
import { Brightness4 as DarkModeIcon, Brightness7 as LightModeIcon } from '@mui/icons-material';
import { createPortal } from 'react-dom';

interface ThemeToggleProps {
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ onToggle }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return createPortal(
    <Box
      sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 9999
      }}
    >
      <Tooltip title={`切换到${isDark ? '浅色' : '深色'}主题`}>
        <IconButton
          onClick={onToggle}
          color="inherit"
          sx={{
            backgroundColor: theme.palette.background.paper,
            '&:hover': {
              backgroundColor: theme.palette.action.hover
            }
          }}
        >
          {isDark ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Tooltip>
    </Box>,
    document.body
  );
};

export default ThemeToggle;

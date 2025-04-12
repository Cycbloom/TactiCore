import React from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface ConsoleInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
}

export const ConsoleInput: React.FC<ConsoleInputProps> = ({
  value,
  onChange,
  onSubmit,
  onKeyDown
}) => {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
    onKeyDown?.(event);
  };

  return (
    <TextField
      fullWidth
      variant="outlined"
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="输入命令..."
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <span style={{ color: 'inherit' }}>{'>'}</span>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={onSubmit} edge="end" disabled={!value.trim()}>
                <SendIcon />
              </IconButton>
            </InputAdornment>
          )
        }
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          fontFamily: 'Consolas, Monaco, monospace'
        }
      }}
    />
  );
};

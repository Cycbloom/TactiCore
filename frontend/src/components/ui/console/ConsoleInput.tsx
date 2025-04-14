import React, { useRef } from 'react';
import { TextField, Box, InputAdornment, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface ConsoleInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (input: string) => Promise<void>;
  onKeyDown: (event: React.KeyboardEvent) => void;
}

export const ConsoleInput: React.FC<ConsoleInputProps> = ({
  value,
  onChange,
  onSubmit,
  onKeyDown
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        inputRef={inputRef}
        fullWidth
        variant="outlined"
        value={value}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        placeholder="输入命令..."
        autoFocus
        size="small"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <span style={{ color: 'inherit' }}>{'>'}</span>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSubmit} edge="end" disabled={!value.trim()} size="small">
                  <SendIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            )
          }
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            fontFamily: 'Consolas, Monaco, monospace',
            backgroundColor: theme => (theme.palette.mode === 'dark' ? '#2d2d2d' : '#f5f5f5'),
            '& fieldset': {
              borderColor: 'transparent',
              borderWidth: '1px 0 0 0'
            },
            '&:hover fieldset': {
              borderColor: theme => (theme.palette.mode === 'dark' ? '#666' : '#bbb')
            },
            '&.Mui-focused fieldset': {
              borderColor: theme => theme.palette.primary.main
            }
          }
        }}
      />
    </Box>
  );
};

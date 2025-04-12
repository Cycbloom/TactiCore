import { TextField, Typography } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';

interface ConsoleInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export const ConsoleInput: React.FC<ConsoleInputProps> = ({ value, onChange, onSubmit }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        fullWidth
        variant="outlined"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="输入命令..."
        slotProps={{
          input: {
            startAdornment: (
              <Typography
                component="span"
                sx={{
                  color: 'primary.main',
                  mr: 1,
                  fontWeight: 'bold'
                }}
              >
                {'>'}
              </Typography>
            ),
            endAdornment: (
              <SendIcon
                sx={{
                  color: 'primary.main',
                  cursor: 'pointer',
                  '&:hover': {
                    color: 'primary.dark'
                  }
                }}
                onClick={() => {
                  if (value.trim()) {
                    onSubmit();
                  }
                }}
              />
            )
          }
        }}
        sx={{
          '& .MuiInputBase-root': {
            backgroundColor: theme => (theme.palette.mode === 'dark' ? '#2d2d2d' : '#f5f5f5'),
            borderRadius: 1,
            '&:hover': {
              backgroundColor: theme => (theme.palette.mode === 'dark' ? '#333333' : '#eeeeee')
            }
          },
          '& .MuiInputBase-input': {
            fontFamily: 'Consolas, Monaco, monospace',
            color: theme => (theme.palette.mode === 'dark' ? '#d4d4d4' : '#000000')
          }
        }}
        autoFocus
      />
    </form>
  );
};

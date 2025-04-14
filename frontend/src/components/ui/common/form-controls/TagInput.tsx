// src/components/forms/TagInput.tsx
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Box, Chip, TextField } from '@mui/material';

interface Props {
  name: string;
  label: string;
}

const TagInput = ({ name, label }: Props) => {
  const [inputValue, setInputValue] = useState('');
  const {
    setValue,
    watch,
    formState: { errors }
  } = useFormContext();
  const tags = (watch(name) || []) as string[];

  const handleAddTag = (tag: string) => {
    if (tag.trim()) {
      const newTags = [...tags, tag.trim()];
      setValue('tags', newTags);
      setInputValue('');
    }
  };

  const handleRemoveTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setValue('tags', newTags);
  };

  return (
    <Box>
      <TextField
        label={label}
        variant="outlined"
        fullWidth
        margin="normal"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag(inputValue);
          }
        }}
        error={!!errors[name]}
        helperText={errors[name]?.message?.toString()}
      />
      <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {tags.map((tag, index) => (
          <Chip key={index} label={tag} onDelete={() => handleRemoveTag(index)} />
        ))}
      </Box>
    </Box>
  );
};

export default TagInput;

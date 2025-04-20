// src/components/forms/TagAutocomplete.tsx
import { Autocomplete, TextField, Chip, IconButton, Box } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useFormContext } from 'react-hook-form';

import { useData } from '@/data/DataContext';

interface TagAutocompleteProps {
  name?: string;
  placeholder?: string;
}

const TagAutocomplete = ({
  name = 'tags',
  placeholder = '选择或输入标签'
}: TagAutocompleteProps) => {
  const { tags } = useData();
  const { setValue, watch } = useFormContext();
  const selectedTags = watch(name) || [];

  const handleRefreshTag = () => {
    setValue(name, []); // 清空已选择的标签
    tags.refresh(); // 重新获取标签数据
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Autocomplete
        multiple
        freeSolo
        options={tags.data}
        value={selectedTags}
        onChange={(_event, newValue) => {
          // 过滤掉重复的标签
          const uniqueTags = newValue.filter(
            (tag, index, self) =>
              index === self.findIndex(t => t.toLowerCase() === tag.toLowerCase())
          );
          setValue(name, uniqueTags);
        }}
        renderInput={params => (
          <TextField {...params} variant="outlined" placeholder={placeholder} />
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            const { key, ...otherProps } = getTagProps({ index });
            return <Chip key={key} label={option} {...otherProps} />;
          })
        }
        sx={{ flex: 1 }}
      />
      <IconButton onClick={handleRefreshTag} size="small">
        <RefreshIcon />
      </IconButton>
    </Box>
  );
};

export default TagAutocomplete;

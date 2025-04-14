// src/components/forms/GenericSelect.tsx
import { useFormContext } from 'react-hook-form';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { ReactNode } from 'react';

export interface SelectOption {
  value: string;
  label: ReactNode;
}

interface GenericSelectProps {
  name: string;
  label: string;
  options: SelectOption[];
}

const GenericSelect = ({ name, label, options }: GenericSelectProps) => {
  const {
    register,
    formState: { errors },
    watch
  } = useFormContext();

  return (
    <FormControl fullWidth margin="normal">
      <InputLabel>{label}</InputLabel>
      <Select label={label} {...register(name)} value={watch(name) || ''} error={!!errors[name]}>
        {options.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default GenericSelect;

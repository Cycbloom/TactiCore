import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { useFormContext } from 'react-hook-form';

interface NumberInputProps extends Omit<TextFieldProps, 'name'> {
  name: string;
  label: string;
  min?: number;
  max?: number;
  step?: number;
  validation?: any;
}

const NumberInput: React.FC<NumberInputProps> = ({
  name,
  label,
  min,
  max,
  step = 1,
  validation,
  ...props
}) => {
  const {
    register,
    formState: { errors }
  } = useFormContext();

  return (
    <TextField
      label={label}
      {...register(name, {
        ...validation,
        setValueAs: (value: string) => {
          if (value === '') return undefined;
          const num = Number(value);
          return isNaN(num) ? undefined : num;
        }
      })}
      type="number"
      variant="outlined"
      fullWidth
      margin="normal"
      error={!!errors[name]}
      helperText={errors[name]?.message?.toString()}
      slotProps={{
        htmlInput: {
          min,
          max,
          step,
          ...props.slotProps?.htmlInput
        }
      }}
      {...props}
    />
  );
};

export default NumberInput;

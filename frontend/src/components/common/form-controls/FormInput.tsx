// 通用表单组件 src/components/forms/FormInput.tsx
import { useFormContext } from 'react-hook-form';
import { TextField, TextFieldProps } from '@mui/material';

type FormInputProps = TextFieldProps & {
  name: string;
  label: string;
  validation?: any;
};

const FormInput = ({ name, label, validation, ...props }: FormInputProps) => {
  const {
    register,
    formState: { errors }
  } = useFormContext();

  return (
    <TextField
      label={label}
      {...register(name, validation)}
      variant="outlined"
      fullWidth
      margin="normal"
      error={!!errors[name]}
      helperText={errors[name]?.message?.toString()}
      {...props}
    />
  );
};

export default FormInput;

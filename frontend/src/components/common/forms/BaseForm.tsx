import { Button, Typography, Box } from '@mui/material';
import {
  SubmitHandler,
  FieldValues,
  UseFormReturn,
  DefaultValues,
  WatchObserver
} from 'react-hook-form';
import { ZodSchema } from 'zod';
import { useCallback } from 'react';

import FormProviderWrapper from './FormPrividerWrapper';
import FormWithWatch from './FormWithWatch';

interface BaseFormProps<T extends FieldValues> {
  onSubmit: SubmitHandler<T>;
  defaultValues: DefaultValues<T>;
  submitButtonText?: string;
  formTitle: string;
  schema: ZodSchema<T>;
  children: React.ReactNode;
  resetAfterSubmit?: boolean;
  onFormDataChange?: (data: T) => void;
  onCancel?: () => void;
  showCancelButton?: boolean;
  cancelButtonText?: string;
}

const BaseForm = <T extends FieldValues>({
  onSubmit,
  defaultValues,
  submitButtonText,
  formTitle,
  schema,
  children,
  resetAfterSubmit = true,
  onFormDataChange,
  onCancel,
  showCancelButton = true,
  cancelButtonText = '取消'
}: BaseFormProps<T>) => {
  const handleFormChange = useCallback<WatchObserver<T>>(
    value => {
      onFormDataChange?.(value as T);
    },
    [onFormDataChange]
  );

  return (
    <FormProviderWrapper<T> defaultValues={defaultValues} schema={schema}>
      {(methods: UseFormReturn<T>) => (
        <FormWithWatch methods={methods} onFormDataChange={handleFormChange}>
          {({ handleSubmit, reset }) => (
            <form
              onSubmit={handleSubmit((data: T) => {
                onSubmit(data);
                if (resetAfterSubmit) {
                  reset(defaultValues as T);
                }
              })}
            >
              {formTitle && (
                <Typography variant="h6" gutterBottom>
                  {formTitle}
                </Typography>
              )}
              {children}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                {showCancelButton && onCancel && (
                  <Button variant="outlined" onClick={onCancel}>
                    {cancelButtonText}
                  </Button>
                )}
                {submitButtonText && (
                  <Button variant="contained" color="primary" type="submit">
                    {submitButtonText || '提交'}
                  </Button>
                )}
              </Box>
            </form>
          )}
        </FormWithWatch>
      )}
    </FormProviderWrapper>
  );
};

export default BaseForm;

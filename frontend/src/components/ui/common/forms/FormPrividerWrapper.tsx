// 修改后组件代码
import { DefaultValues, FieldValues, FormProvider, useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReactNode } from 'react';
import { ZodSchema } from 'zod';

interface FormProviderWrapperProps<T extends FieldValues> {
  children: (methods: UseFormReturn<T>) => ReactNode;
  defaultValues: DefaultValues<T>;
  schema: ZodSchema<T>;
}

const FormProviderWrapper = <T extends FieldValues>({
  children,
  defaultValues,
  schema
}: FormProviderWrapperProps<T>) => {
  const methods = useForm<T>({
    resolver: zodResolver(schema), // 使用传入的 schema
    defaultValues
  });

  return <FormProvider {...methods}>{children(methods)}</FormProvider>;
};

export default FormProviderWrapper;

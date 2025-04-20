import { useEffect } from 'react';
import { UseFormReturn, WatchObserver } from 'react-hook-form';

interface FormWithWatchProps<T extends object> {
  children: (methods: UseFormReturn<T>) => React.ReactNode;
  methods: UseFormReturn<T>;
  onFormDataChange?: WatchObserver<T>;
}

const FormWithWatch = <T extends object>({
  children,
  methods,
  onFormDataChange
}: FormWithWatchProps<T>) => {
  const { watch } = methods;

  useEffect(() => {
    if (onFormDataChange) {
      const subscription = watch(onFormDataChange);
      return () => subscription.unsubscribe();
    }
  }, [watch, onFormDataChange]);

  return <>{children(methods)}</>;
};

export default FormWithWatch;

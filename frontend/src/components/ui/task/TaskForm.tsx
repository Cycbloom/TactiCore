import React from 'react';
import { Stack } from '@mui/material';
import { SubmitHandler } from 'react-hook-form';
import * as z from 'zod';

import { Task } from '@/types/task';
import { BaseForm } from '@/components/ui/common/forms';
import {
  FormInput,
  PrioritySelect,
  StatusSelect,
  DatePickerField,
  TagAutocomplete
} from '@/components/ui/common/form-controls';

const taskSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  description: z.string().optional(),
  status: z.enum(['todo', 'inProgress', 'completed']),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.date().optional(),
  tags: z.array(z.string()).optional()
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  initialData?: Partial<Task>;
  onSubmit: SubmitHandler<TaskFormData>;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const defaultValues: TaskFormData = {
    title: initialData?.title || '',
    description: initialData?.description || '',
    status: initialData?.status || 'todo',
    priority: initialData?.priority || 'medium',
    dueDate: initialData?.dueDate,
    tags: initialData?.tags || []
  };

  return (
    <BaseForm<TaskFormData>
      onSubmit={onSubmit}
      defaultValues={defaultValues}
      schema={taskSchema}
      formTitle={initialData ? '编辑任务' : '创建任务'}
      submitButtonText={initialData ? '更新' : '创建'}
      resetAfterSubmit={true}
      onCancel={onCancel}
    >
      <Stack spacing={3}>
        <FormInput
          name="title"
          label="标题"
          placeholder="输入任务标题"
          validation={{ required: true }}
        />

        <FormInput name="description" label="描述" placeholder="输入任务描述" multiline rows={4} />

        <Stack direction="row" spacing={2}>
          <StatusSelect />
          <PrioritySelect />
        </Stack>

        <DatePickerField name="dueDate" label="截止日期" />

        <TagAutocomplete name="tags" placeholder="选择或输入标签" />
      </Stack>
    </BaseForm>
  );
};

export default TaskForm;

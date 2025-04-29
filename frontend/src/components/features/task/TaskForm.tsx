import React from 'react';
import { Stack } from '@mui/material';
import { SubmitHandler } from 'react-hook-form';

import { Task } from '@/types/task';
import { BaseForm } from '@/components/common/forms';
import {
  FormInput,
  PrioritySelect,
  StatusSelect,
  DatePickerField,
  TagAutocomplete,
  NumberInput
} from '@/components/common/form-controls';
import { taskSchema, TaskFormData } from '@/types/task';

interface TaskFormProps {
  initialData?: Partial<Task>;
  onSubmit: SubmitHandler<TaskFormData>;
  onCancel: () => void;
  formTitle?: string;
  submitText?: string;
}

const TaskForm: React.FC<TaskFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  formTitle,
  submitText
}) => {
  const defaultValues: TaskFormData = {
    title: initialData?.title || '',
    description: initialData?.description || '',
    status: initialData?.status || 'todo',
    priority: initialData?.priority || 'medium',
    priorityScore: initialData?.priorityScore || 50,
    estimatedHours: initialData?.estimatedHours || 0,
    actualHours: initialData?.actualHours || 0,
    dueDate: initialData?.dueDate ? new Date(initialData.dueDate) : undefined,
    tags: initialData?.tags || [],
    parentId: initialData?.parentId || undefined,
    dependencies: initialData?.dependencies || []
  };

  return (
    <BaseForm<TaskFormData>
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={onCancel}
      schema={taskSchema}
      formTitle={formTitle || (initialData ? '编辑任务' : '创建任务')}
      submitButtonText={submitText || (initialData ? '更新' : '创建')}
      resetAfterSubmit={true}
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

        <Stack direction="row" spacing={2}>
          <NumberInput
            name="priorityScore"
            label="优先级分数"
            min={0}
            max={100}
            step={1}
            validation={{ required: true }}
          />
          <NumberInput name="estimatedHours" label="预计工时" min={0} step={0.5} />
          <NumberInput name="actualHours" label="实际工时" min={0} step={0.5} />
        </Stack>

        <DatePickerField name="dueDate" label="截止日期" />

        <TagAutocomplete name="tags" placeholder="选择或输入标签" />
      </Stack>
    </BaseForm>
  );
};

export default TaskForm;

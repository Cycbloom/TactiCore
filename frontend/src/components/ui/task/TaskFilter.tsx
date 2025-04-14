import React from 'react';
import { Box } from '@mui/material';
import * as z from 'zod';

import { BaseForm } from '@/components/ui/common/forms';
import FormInput from '@/components/ui/common/form-controls/FormInput';
import GenericSelect, { SelectOption } from '@/components/ui/common/form-controls/GenericSelect';

type FilterFormData = {
  searchTerm: string;
  statusFilter: 'all' | 'todo' | 'inProgress' | 'completed';
  priorityFilter: 'all' | 'high' | 'medium' | 'low';
};

const filterSchema = z.object({
  searchTerm: z.string(),
  statusFilter: z.enum(['all', 'todo', 'inProgress', 'completed']),
  priorityFilter: z.enum(['all', 'high', 'medium', 'low'])
}) as z.ZodType<FilterFormData>;

interface TaskFilterProps {
  onFilterChange: (filters: FilterFormData) => void;
}

const statusOptions: SelectOption[] = [
  { value: 'all', label: '全部状态' },
  { value: 'todo', label: '待办' },
  { value: 'inProgress', label: '进行中' },
  { value: 'completed', label: '已完成' }
];

const priorityOptions: SelectOption[] = [
  { value: 'all', label: '全部优先级' },
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' }
];

const TaskFilter: React.FC<TaskFilterProps> = ({ onFilterChange }) => {
  const defaultValues: FilterFormData = {
    searchTerm: '',
    statusFilter: 'all',
    priorityFilter: 'all'
  };

  return (
    <BaseForm<FilterFormData>
      onSubmit={onFilterChange}
      defaultValues={defaultValues}
      schema={filterSchema}
      formTitle=""
      submitButtonText=""
      resetAfterSubmit={false}
      onFormDataChange={onFilterChange}
    >
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
        <Box sx={{ flex: 2 }}>
          <FormInput name="searchTerm" label="搜索任务" />
        </Box>
        <Box sx={{ flex: 1 }}>
          <GenericSelect name="statusFilter" label="状态筛选" options={statusOptions} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <GenericSelect name="priorityFilter" label="优先级筛选" options={priorityOptions} />
        </Box>
      </Box>
    </BaseForm>
  );
};

export default TaskFilter;

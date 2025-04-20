import React from 'react';
import { Box } from '@mui/material';

import { BaseForm } from '@/components/common/forms';
import FormInput from '@/components/common/form-controls/FormInput';
import GenericSelect from '@/components/common/form-controls/GenericSelect';
import {
  FilterFormData,
  filterSchema,
  statusOptionsWithAll,
  priorityOptionsWithAll
} from '@/types/task';

interface TaskFilterProps {
  filters: FilterFormData;
  onFilterChange: (filters: FilterFormData) => void;
}

const TaskFilter: React.FC<TaskFilterProps> = ({ filters, onFilterChange }) => {
  return (
    <BaseForm<FilterFormData>
      onSubmit={onFilterChange}
      defaultValues={filters}
      schema={filterSchema}
      formTitle=""
      submitButtonText=""
      resetAfterSubmit={false}
      onFormDataChange={onFilterChange}
    >
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
        <Box sx={{ flex: 2 }}>
          <FormInput name="search" label="搜索任务" />
        </Box>
        <Box sx={{ flex: 1 }}>
          <GenericSelect name="status" label="状态筛选" options={statusOptionsWithAll} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <GenericSelect name="priority" label="优先级筛选" options={priorityOptionsWithAll} />
        </Box>
      </Box>
    </BaseForm>
  );
};

export default TaskFilter;

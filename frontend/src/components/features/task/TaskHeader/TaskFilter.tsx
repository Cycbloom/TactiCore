import React from 'react';
import { Box } from '@mui/material';
import debounce from 'lodash/debounce';

import { BaseForm } from '@/components/common/forms';
import { FormInput, GenericSelect } from '@/components/common/form-controls';
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
  // 使用 useMemo 来创建 debounced 函数
  const debouncedFilterChange = React.useMemo(
    () =>
      debounce((newFilters: FilterFormData) => {
        onFilterChange(newFilters);
      }, 300),
    [onFilterChange]
  );

  return (
    <BaseForm<FilterFormData>
      onSubmit={onFilterChange}
      defaultValues={filters}
      schema={filterSchema}
      formTitle=""
      submitButtonText=""
      resetAfterSubmit={false}
      onFormDataChange={debouncedFilterChange}
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

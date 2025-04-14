// src/components/forms/PrioritySelect.tsx
import { JSX } from 'react';
import { Chip, Box } from '@mui/material';
import { PriorityHigh, Schedule, LowPriority } from '@mui/icons-material';

import GenericSelect from './GenericSelect';

import { priorityOptions, PriorityKey } from '@/types/task';

// 增强的优先级选项配置
const priorityConfig = {
  high: {
    color: '#ff4444',
    icon: <PriorityHigh fontSize="small" />,
    label: '紧急优先'
  },
  medium: {
    color: '#ffb74d',
    icon: <Schedule fontSize="small" />,
    label: '常规处理'
  },
  low: {
    color: '#4caf50',
    icon: <LowPriority fontSize="small" />,
    label: '后台任务'
  }
} satisfies Record<PriorityKey, { color: string; icon: JSX.Element; label: string }>;

interface PrioritySelectProps {
  name?: string;
  label?: string;
}

const PrioritySelect = ({ name = 'priority', label = '优先级' }: PrioritySelectProps) => (
  <GenericSelect
    name={name}
    label={label}
    options={priorityOptions.map(opt => {
      const priorityKey = opt.value as PriorityKey;
      return {
        ...opt,
        label: (
          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              icon={priorityConfig[priorityKey].icon}
              label={priorityConfig[priorityKey].label}
              style={{
                backgroundColor: priorityConfig[priorityKey].color + '22',
                border: `1px solid ${priorityConfig[priorityKey].color}`
              }}
            />
          </Box>
        ),
        value: opt.value
      };
    })}
  />
);

export default PrioritySelect;

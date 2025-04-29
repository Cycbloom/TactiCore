// src/components/forms/PrioritySelect.tsx
import { JSX } from 'react';
import { Chip, Box } from '@mui/material';
import { PriorityHigh, Schedule, LowPriority, Warning, Flag } from '@mui/icons-material';

import GenericSelect from './GenericSelect';

import { priorityOptions, PriorityKey } from '@/types/task';

// 增强的优先级选项配置
const priorityConfig = {
  urgent: {
    color: '#ff1744',
    icon: <Warning fontSize="small" />,
    label: '紧急处理'
  },
  high: {
    color: '#ff4444',
    icon: <PriorityHigh fontSize="small" />,
    label: '高优先级'
  },
  medium: {
    color: '#ffb74d',
    icon: <Schedule fontSize="small" />,
    label: '常规处理'
  },
  low: {
    color: '#4caf50',
    icon: <LowPriority fontSize="small" />,
    label: '低优先级'
  },
  minimal: {
    color: '#2196f3',
    icon: <Flag fontSize="small" />,
    label: '最低优先级'
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

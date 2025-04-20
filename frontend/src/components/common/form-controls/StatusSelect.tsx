import GenericSelect from './GenericSelect';

import { statusOptions } from '@/types/task';

interface StatusSelectProps {
  name?: string;
  label?: string;
}

const StatusSelect = ({ name = 'status', label = '状态' }: StatusSelectProps) => {
  return <GenericSelect name={name} label={label} options={statusOptions} />;
};

export default StatusSelect;

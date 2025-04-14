import React from 'react';

import { ConsoleContent } from './ConsoleContent';

import { ConsoleProvider } from '@/components/providers/console/ConsoleProvider';
// 外部组件，提供 Context
export const Console: React.FC = () => {
  return (
    <ConsoleProvider>
      <ConsoleContent />
    </ConsoleProvider>
  );
};

import React from 'react';

import { ConsoleContent } from './ConsoleContent';

import { ConsoleProvider } from '@/components/providers/console/ConsoleProvider';
// 外部组件，提供 Context
const Console: React.FC = () => {
  return (
    <ConsoleProvider>
      <ConsoleContent />
    </ConsoleProvider>
  );
};

export default Console;

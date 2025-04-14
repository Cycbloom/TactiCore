import React from 'react';
import { Box } from '@mui/material';

import { ConsoleTabs } from './ConsoleTabs';
import { ConsoleOutput } from './ConsoleOutput';
import { ConsoleInput } from './ConsoleInput';

import { useConsole } from '@/components/providers';
import { ResizableContainer } from '@/components/ui/common/layout';

export const ConsoleContent: React.FC = () => {
  const { consoles, activeConsoleId, showConsole, setInput, handleSubmit, handleKeyDown } =
    useConsole();
  const activeConsole = consoles.find(c => c.id === activeConsoleId);

  if (!activeConsole) return null;

  return (
    showConsole && (
      <ResizableContainer minHeight={200} maxHeight={600} initialHeight={300}>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <ConsoleTabs />
          </Box>
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <ConsoleOutput output={activeConsole.output} />
          </Box>
          <Box sx={{ borderTop: 1, borderColor: 'divider' }}>
            <ConsoleInput
              value={activeConsole.input}
              onChange={value => setInput(activeConsoleId, value)}
              onSubmit={() => handleSubmit(activeConsoleId)}
              onKeyDown={e => handleKeyDown(activeConsoleId, e)}
            />
          </Box>
        </Box>
      </ResizableContainer>
    )
  );
};

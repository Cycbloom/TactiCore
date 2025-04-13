import { CommandResult } from './command';

import { CommandManager } from '@/utils/command/manager';

export interface ConsoleState {
  id: string;
  name: string;
  input: string;
  output: CommandResult[];
  commandHistory: string[];
  historyIndex: number;
  showLogs: boolean;
  commandManager: CommandManager;
}

export interface ConsoleContextType {
  consoles: ConsoleState[];
  activeConsoleId: string;
  setInput: (consoleId: string, value: string) => void;
  handleSubmit: (consoleId: string) => Promise<void>;
  handleKeyDown: (consoleId: string, e: React.KeyboardEvent) => void;
  createConsole: () => void;
  deleteConsole: (consoleId: string) => void;
  renameConsole: (consoleId: string, newName: string) => void;
  setActiveConsole: (consoleId: string) => void;
  setShowLogs: (consoleId: string, show: boolean) => void;
}

import { helpCommand } from './help';
import { clsCommand } from './cls';
import { echoCommand } from './echo';
import { debugCommand } from './debug';

import { Command } from '@/types/command';

/**
 * 所有可用命令的集合
 */
export const commands: Command[] = [
  helpCommand,
  clsCommand,
  echoCommand,
  debugCommand
  // TODO: 添加更多命令
];

/**
 * 注册所有命令到命令管理器
 * @param manager 命令管理器实例
 */
export const registerCommands = (manager: any): void => {
  commands.forEach(command => manager.register(command));
};

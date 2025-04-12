import { Command, SpecialCommandResult, CommandAction } from '@/types/command';

/**
 * 清除控制台输出命令
 */
export const clsCommand: Command = {
  name: 'cls',
  description: '清除控制台输出',
  usage: 'cls',
  execute: async (): Promise<SpecialCommandResult> => {
    return {
      success: true,
      message: '控制台已清除',
      action: CommandAction.CLEAR_CONSOLE
    };
  }
};

import { Command, CommandResult } from '@/types/command';

/**
 * 帮助命令实现
 */
export const helpCommand: Command = {
  name: 'help',
  description: '显示所有可用命令的帮助信息',
  usage: 'help [command]',
  options: [
    {
      name: 'command',
      description: '要查看帮助的特定命令名称',
      type: 'string',
      required: false
    }
  ],
  execute: async (args): Promise<CommandResult> => {
    const commandName = args.command as string;

    if (commandName) {
      // TODO: 实现特定命令的帮助信息显示
      return {
        success: true,
        message: `显示命令 '${commandName}' 的帮助信息`
      };
    }

    return {
      success: true,
      message: '显示所有命令的帮助信息'
    };
  }
};

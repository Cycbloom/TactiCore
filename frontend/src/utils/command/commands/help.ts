import { commands } from './index';

import { Command, CommandResult } from '@/types/command';
import { logger } from '@/utils/logger';

/**
 * 帮助命令实现
 */
export const helpCommand: Command = {
  name: 'help',
  description: '显示所有可用命令的帮助信息',
  usage: 'help [command] [--verbose]',
  options: [
    {
      name: 'command',
      description: '要查看帮助的特定命令名称',
      type: 'string',
      required: false
    },
    {
      name: 'verbose',
      alias: 'v',
      description: '显示详细帮助信息',
      type: 'boolean',
      required: false,
      default: false
    }
  ],
  execute: async (args): Promise<CommandResult> => {
    const commandName = args.command as string;
    const verbose = (args.verbose as boolean) || false;

    logger.debug(`帮助命令参数: ${commandName} ${verbose}`);

    // 如果没有指定命令名称，显示所有命令列表
    if (!commandName) {
      const commandList = commands
        .map(cmd => {
          return `  ${cmd.name.padEnd(15)} - ${cmd.description}`;
        })
        .join('\n');

      return {
        success: true,
        message: `可用命令列表:\n${commandList}\n\n使用 'help <命令名>' 查看特定命令的详细帮助信息。`
      };
    }

    // 查找指定命令
    const command = commands.find(cmd => cmd.name === commandName);

    if (!command) {
      return {
        success: false,
        message: `错误: 未找到命令 '${commandName}'`
      };
    }

    // 显示特定命令的帮助信息
    let helpText = `命令: ${command.name}\n`;
    helpText += `描述: ${command.description}\n`;
    helpText += `用法: ${command.usage}\n`;

    // 如果有选项且需要详细模式，显示选项信息
    if (command.options && command.options.length > 0 && verbose) {
      helpText += '\n选项:\n';
      command.options.forEach(option => {
        const aliasText = option.alias ? `, -${option.alias}` : '';
        const requiredText = option.required ? ' (必需)' : '';
        const defaultText = option.default !== undefined ? ` (默认: ${option.default})` : '';

        helpText += `  --${option.name}${aliasText}${requiredText}${defaultText}\n`;
        helpText += `      ${option.description}\n`;
      });
    }

    return {
      success: true,
      message: helpText
    };
  }
};

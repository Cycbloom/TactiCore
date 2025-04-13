import { logger } from '../logger';

import { ParsedCommand, CommandArgs, Command, CommandOption } from '@/types/command';

/**
 * 命令解析器类
 */
export class CommandParser {
  /**
   * 解析命令字符串
   * @param input 用户输入的命令字符串
   * @param commandRegistry 命令注册表，用于查找命令定义
   * @returns 解析后的命令对象
   */
  static parse(input: string, commandRegistry?: Record<string, Command>): ParsedCommand {
    const parts = input.trim().split(/\s+/);
    const name = parts[0];
    const args: CommandArgs = {};

    // 如果提供了命令注册表，尝试查找命令定义
    let command: Command | undefined;
    let options: CommandOption[] = [];
    if (commandRegistry && name in commandRegistry) {
      command = commandRegistry[name];
      options = command.options || [];
    }

    // 解析参数
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];

      // 处理长选项 (--option)
      if (part.startsWith('--')) {
        const optionName = part.slice(2);

        // 检查是否有等号 (--option=value)
        if (optionName.includes('=')) {
          const [key, value] = optionName.split('=');
          args[key] = value;
        }
        // 没有等号，检查下一个参数是否为值
        else {
          // 查找对应的选项定义
          const option = options.find(opt => opt.name === optionName);

          // 如果选项存在且不是布尔类型，且下一个参数不是选项，则将其视为值
          if (
            option &&
            option.type !== 'boolean' &&
            i + 1 < parts.length &&
            !parts[i + 1].startsWith('-')
          ) {
            args[optionName] = parts[i + 1];
            i++; // 跳过下一个参数
          } else {
            // 布尔选项或没有值的长选项
            args[optionName] = true;
          }
        }
      }
      // 处理短选项 (-a, -abc)
      else if (part.startsWith('-') && part.length > 1) {
        const shortOptions = part.slice(1).split('');

        // 处理每个短选项
        for (let j = 0; j < shortOptions.length; j++) {
          const shortOption = shortOptions[j];

          // 查找对应的选项定义
          const option = options.find(opt => opt.alias === shortOption);

          // 如果是最后一个短选项，且不是布尔类型，且下一个参数不是选项，则将其视为值
          if (
            j === shortOptions.length - 1 &&
            option &&
            option.type !== 'boolean' &&
            i + 1 < parts.length &&
            !parts[i + 1].startsWith('-')
          ) {
            args[option.name] = parts[i + 1];
            i++; // 跳过下一个参数
          } else {
            // 布尔选项或非最后一个短选项
            if (option) {
              args[option.name] = true;
            } else {
              // 未找到对应的选项定义，使用短选项名作为键
              args[shortOption] = true;
            }
          }
        }
      }
      // 处理位置参数
      else {
        // 对于help命令，第一个位置参数视为命令名称
        if (name === 'help' && !args.command) {
          args.command = part;
        }
        // 对于debug命令，第一个位置参数视为state
        else if (name === 'debug' && !args.state) {
          args.state = part;
        }
        // 其他命令的位置参数使用arg1, arg2等作为键
        else {
          const argIndex = Object.keys(args).filter(k => k.startsWith('arg')).length + 1;
          args[`arg${argIndex}`] = part;
        }
      }
    }

    logger.debug(`命令: ${name} ${JSON.stringify(args)}`);

    return { name, args };
  }

  /**
   * 验证命令参数
   * @param args 命令参数
   * @param options 命令选项定义
   * @returns 验证结果
   */
  static validateArgs(args: CommandArgs, options: CommandOption[]): boolean {
    // 检查必填选项
    for (const option of options) {
      if (option.required && !(option.name in args)) {
        logger.warn(`缺少必填选项: ${option.name}`);
        return false;
      }
    }

    return true;
  }
}

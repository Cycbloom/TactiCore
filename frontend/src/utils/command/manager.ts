import { CommandParser } from './parser';
import { registerCommands } from './commands';

import { Command, CommandRegistry, CommandResult, SpecialCommandResult } from '@/types/command';

/**
 * 命令管理器类
 */
export class CommandManager {
  private registry: CommandRegistry = {};

  constructor() {
    registerCommands(this);
  }

  /**
   * 注册命令
   * @param command 命令对象
   */
  register(command: Command): void {
    this.registry[command.name] = command;
  }

  /**
   * 执行命令
   * @param input 用户输入的命令字符串
   * @returns 命令执行结果
   */
  async execute(input: string): Promise<CommandResult | SpecialCommandResult> {
    const { name, args } = CommandParser.parse(input, this.registry);
    const command = this.registry[name];

    if (!command) {
      return {
        success: false,
        message: `命令 '${name}' 不存在`
      };
    }

    try {
      return await command.execute(args);
    } catch (error: any) {
      return {
        success: false,
        message: `执行命令 '${name}' 时发生错误: ${error?.message || '未知错误'}`
      };
    }
  }

  /**
   * 获取所有已注册的命令
   * @returns 命令列表
   */
  getCommands(): Command[] {
    return Object.values(this.registry);
  }
}

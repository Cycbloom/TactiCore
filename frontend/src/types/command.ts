/**
 * 命令执行结果接口
 */
export interface CommandResult {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * 命令参数接口
 */
export interface CommandArgs {
  [key: string]: string | number | boolean;
}

/**
 * 命令选项接口
 */
export interface CommandOption {
  name: string;
  alias?: string;
  description: string;
  required?: boolean;
  type: 'string' | 'number' | 'boolean';
  default?: any;
}

/**
 * 命令定义接口
 */
export interface Command {
  name: string;
  description: string;
  usage: string;
  options?: CommandOption[];
  execute: (args: CommandArgs) => Promise<CommandResult>;
}

/**
 * 命令注册表接口
 */
export interface CommandRegistry {
  [key: string]: Command;
}

/**
 * 命令历史记录接口
 */
export interface CommandHistory {
  command: string;
  timestamp: number;
  result: CommandResult;
}

/**
 * 命令解析结果接口
 */
export interface ParsedCommand {
  name: string;
  args: CommandArgs;
}

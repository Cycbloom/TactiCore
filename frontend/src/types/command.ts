/**
 * 命令系统类型定义
 *
 * 本文件定义了命令系统所需的所有类型，按照以下层次组织：
 * 1. 基础类型 - 命令参数、选项等基本类型
 * 2. 命令定义 - 命令接口及其相关类型
 * 3. 命令执行 - 命令执行结果及相关类型
 * 4. 命令历史 - 命令历史记录相关类型
 */

// ==================== 基础类型 ====================

/**
 * 命令参数接口
 * 表示命令的参数，键值对形式
 */
export interface CommandArgs {
  [key: string]: string | number | boolean;
}

/**
 * 命令选项接口
 * 定义命令的选项，如 --help, -v 等
 */
export interface CommandOption {
  name: string;
  alias?: string;
  description: string;
  required?: boolean;
  type: 'string' | 'number' | 'boolean';
  default?: any;
}

// ==================== 命令定义 ====================

/**
 * 命令定义接口
 * 定义命令的基本结构和行为
 */
export interface Command {
  name: string;
  description: string;
  usage: string;
  options?: CommandOption[];
  execute: (args: CommandArgs) => Promise<CommandResult | SpecialCommandResult>;
}

/**
 * 命令注册表接口
 * 存储所有已注册的命令
 */
export interface CommandRegistry {
  [key: string]: Command;
}

/**
 * 命令解析结果接口
 * 表示解析命令字符串后的结果
 */
export interface ParsedCommand {
  name: string;
  args: CommandArgs;
}

// ==================== 命令执行 ====================

/**
 * 命令执行结果接口
 * 表示命令执行的结果
 */
export interface CommandResult {
  success: boolean;
  message: string;
  isLog?: boolean;
  data?: any;
}

/**
 * 特殊命令操作类型
 * 定义命令可以执行的特殊操作
 */
export enum CommandAction {
  CLEAR_CONSOLE = 'CLEAR_CONSOLE',
  SET_DEBUG_STATE = 'SET_DEBUG_STATE',
  SHOW_DEBUG_STATUS = 'SHOW_DEBUG_STATUS'
  // 未来可以添加更多操作类型
}

/**
 * 特殊命令结果接口
 * 扩展基本命令结果，添加特殊操作
 */
export interface SpecialCommandResult extends CommandResult {
  action?: CommandAction;
  actionData?: any;
}

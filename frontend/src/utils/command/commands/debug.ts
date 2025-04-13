import { Command, CommandResult, SpecialCommandResult, CommandAction } from '@/types/command';

/**
 * debug命令
 * 用于控制当前控制台的日志显示状态
 */
export const debugCommand: Command = {
  name: 'debug',
  description: '控制当前控制台的日志显示状态',
  usage: 'debug [on|off] [--show]',
  options: [
    {
      name: 'state',
      description: '设置日志显示状态 (on/off)',
      type: 'string',
      required: false
    },
    {
      name: 'show',
      alias: 's',
      description: '显示当前日志显示状态',
      type: 'boolean',
      required: false,
      default: false
    }
  ],
  execute: async (args: Record<string, any>): Promise<CommandResult | SpecialCommandResult> => {
    const state = args.state as string;
    const show = (args.show as boolean) || false;

    // 显示当前状态
    if (show) {
      // 这里需要获取当前控制台的showLogs状态
      // 由于命令执行时无法直接访问控制台状态，我们需要通过特殊结果来通知控制台
      return {
        success: true,
        message: '显示日志状态 ',
        action: CommandAction.SHOW_DEBUG_STATUS
      } as SpecialCommandResult;
    }

    // 设置日志显示状态
    if (state) {
      const lowerState = state.toLowerCase();

      // 验证状态值
      if (lowerState !== 'on' && lowerState !== 'off') {
        return {
          success: false,
          message: `错误: 无效的状态值 '${state}'。有效值为: on, off`
        };
      }

      // 通过特殊结果通知控制台更新showLogs状态
      return {
        success: true,
        message: `日志显示已${lowerState === 'on' ? '开启' : '关闭'}`,
        action: CommandAction.SET_DEBUG_STATE,
        actionData: { showLogs: lowerState === 'on' }
      } as SpecialCommandResult;
    }

    // 如果没有参数，显示帮助信息
    return {
      success: true,
      message: `用法: debug [on|off] [--show]\n\non/off: 设置日志显示状态\n--show: 显示当前日志显示状态`
    };
  }
};

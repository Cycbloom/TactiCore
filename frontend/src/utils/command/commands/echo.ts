import { Command, CommandResult } from '@/types/command';

/**
 * echo命令
 * 用于在控制台输出文本内容
 */
export const echoCommand: Command = {
  name: 'echo',
  description: '在控制台输出文本内容',
  usage: 'echo <文本内容>',
  execute: async (args: Record<string, any>): Promise<CommandResult> => {
    // 获取所有参数值并连接成字符串
    const text = Object.values(args).join(' ');

    if (!text) {
      return {
        success: false,
        message: '错误: 请提供要输出的文本内容'
      };
    }

    return {
      success: true,
      message: text
    };
  }
};

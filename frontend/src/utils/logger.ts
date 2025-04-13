/**
 * 日志级别枚举
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

/**
 * 日志配置接口
 */
export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
}

/**
 * 日志条目接口
 */
export interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any[];
}

/**
 * 日志监听器类型
 */
export type LogListener = (entry: LogEntry) => void;

/**
 * 默认日志配置
 */
const DEFAULT_CONFIG: LoggerConfig = {
  level: LogLevel.INFO,
  enableConsole: false
};

/**
 * 日志工具类
 * 用于调试和日志记录
 */
export class Logger {
  private static instance: Logger;
  private config: LoggerConfig;
  private isDevelopment: boolean;
  private listeners: LogListener[] = [];

  /**
   * 私有构造函数，防止直接实例化
   */
  private constructor() {
    this.config = { ...DEFAULT_CONFIG };
    this.isDevelopment = process.env.NODE_ENV === 'development';

    // 在开发环境中默认启用DEBUG级别
    if (this.isDevelopment) {
      this.config.level = LogLevel.DEBUG;
    }
  }

  /**
   * 获取Logger单例
   */
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * 配置Logger
   * @param config 日志配置
   */
  public configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * 获取当前配置
   */
  public getConfig(): LoggerConfig {
    return { ...this.config };
  }

  /**
   * 添加日志监听器
   * @param listener 日志监听器函数
   * @returns 移除监听器的函数
   */
  public addListener(listener: LogListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * 记录DEBUG级别日志
   * @param message 日志消息
   * @param data 附加数据
   */
  public debug(message: string, ...data: any[]): void {
    this.log(LogLevel.DEBUG, message, ...data);
  }

  /**
   * 记录INFO级别日志
   * @param message 日志消息
   * @param data 附加数据
   */
  public info(message: string, ...data: any[]): void {
    this.log(LogLevel.INFO, message, ...data);
  }

  /**
   * 记录WARN级别日志
   * @param message 日志消息
   * @param data 附加数据
   */
  public warn(message: string, ...data: any[]): void {
    this.log(LogLevel.WARN, message, ...data);
  }

  /**
   * 记录ERROR级别日志
   * @param message 日志消息
   * @param data 附加数据
   */
  public error(message: string, ...data: any[]): void {
    this.log(LogLevel.ERROR, message, ...data);
  }

  /**
   * 记录日志
   * @param level 日志级别
   * @param message 日志消息
   * @param data 附加数据
   */
  private log(level: LogLevel, message: string, ...data: any[]): void {
    // 检查日志级别是否满足要求
    if (this.getLogLevelValue(level) < this.getLogLevelValue(this.config.level)) {
      return;
    }

    // 构建日志条目
    const logEntry: LogEntry = {
      level,
      message,
      data: data.length > 0 ? data : undefined
    };

    // 通知所有监听器
    this.notifyListeners(logEntry);
  }

  /**
   * 通知所有监听器
   * @param entry 日志条目
   */
  private notifyListeners(entry: LogEntry): void {
    this.listeners.forEach(listener => {
      try {
        listener(entry);
      } catch (error) {
        console.error('日志监听器执行出错:', error);
      }
    });
  }

  /**
   * 获取日志级别的数值表示
   * @param level 日志级别
   * @returns 日志级别的数值
   */
  private getLogLevelValue(level: LogLevel): number {
    switch (level) {
      case LogLevel.DEBUG:
        return 0;
      case LogLevel.INFO:
        return 1;
      case LogLevel.WARN:
        return 2;
      case LogLevel.ERROR:
        return 3;
      default:
        return 1;
    }
  }
}

/**
 * 导出默认Logger实例
 */
export const logger = Logger.getInstance();

import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) {}

  get<T>(key: string): T | undefined {
    return this.configService.get<T>(key);
  }

  getOrThrow<T>(key: string): T {
    const value = this.get<T>(key);
    if (value === undefined) {
      throw new Error(`配置项 ${key} 未定义`);
    }
    return value;
  }
}

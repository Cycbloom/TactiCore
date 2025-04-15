import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';

import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    // 注册 Passport 模块
    PassportModule,
    // 导入配置模块
    ConfigModule,
    // 配置 JWT 模块
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        // 设置 JWT 密钥
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        // 设置 token 过期时间
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}

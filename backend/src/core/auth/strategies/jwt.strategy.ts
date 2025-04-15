import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '@/core/config/config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      // 从请求头中提取 token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 不忽略过期时间
      ignoreExpiration: false,
      // 使用配置的密钥
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  // 验证 token 并返回用户信息
  async validate(payload: any) {
    return {
      userId: payload.sub,
      username: payload.username,
    };
  }
}

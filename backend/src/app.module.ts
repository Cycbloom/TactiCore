import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './core/config/config.module';
import { HealthController } from './health/health.controller';
import { TaskModule } from './task/task.module';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './core/auth/auth.module';

@Module({
  imports: [ConfigModule, PrismaModule, AuthModule, TaskModule],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}

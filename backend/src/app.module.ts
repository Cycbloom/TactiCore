import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigurationModule } from './core/config/config.module';
import { HealthController } from './health/health.controller';
@Module({
  imports: [ConfigurationModule],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}

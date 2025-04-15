import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma.module';
import { MongoDBService } from './mongodb.service';

@Module({
  imports: [PrismaModule],
  providers: [MongoDBService],
  exports: [PrismaModule, MongoDBService],
})
export class DatabaseModule {}

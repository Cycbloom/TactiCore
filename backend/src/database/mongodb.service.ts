import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { MongoClient } from 'mongodb';

import { ConfigService } from '../core/config/config.service';

@Injectable()
export class MongoDBService implements OnModuleInit, OnModuleDestroy {
  private client: MongoClient;
  private db: any;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const mongoUrl = this.configService.get<string>('MONGO_URL');
    if (!mongoUrl) {
      throw new Error('MongoDB URL is not defined');
    }
    this.client = new MongoClient(mongoUrl);
    await this.client.connect();
    this.db = this.client.db(this.configService.get<string>('MONGO_DB_NAME'));
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  getCollection(collectionName: string) {
    return this.db.collection(collectionName);
  }
}

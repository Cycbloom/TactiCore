import * as Joi from 'joi';

export const configSchema = Joi.object({
  // 应用配置
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),

  // PostgreSQL 配置
  POSTGRES_URL: Joi.string().required(),

  // MongoDB 配置
  MONGO_URL: Joi.string().required(),
  MONGO_DB_NAME: Joi.string().required(),

  // JWT 配置
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('1d'),

  // 其他配置...
}).unknown(true);

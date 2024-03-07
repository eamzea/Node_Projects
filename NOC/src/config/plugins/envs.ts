import 'dotenv/config'
import * as env from 'env-var';

const environment = process.env.NODE_ENV || 'dev';

export const envs = {
  PORT: env.get('PORT').required().asPortNumber(),
  MAILER_EMAIL: env.get('MAILER_EMAIL').required().asEmailString(),
  MAILER_SECRET_KEY: env.get('MAILER_SECRET_KEY').required().asString(),
  MAILER_SERVICE: env.get('MAILER_SERVICE').required().asString(),
  MONGO_URL: env.get('MONGO_URL').required().asString(),
  MONGO_DB_NAME: env.get('MONGO_DB_NAME').required().asString(),
  MONGO_USER: ['dev', 'test'].includes(environment)
    ? env.get('MONGO_USER').asString()
    : env.get('MONGO_USER').required().asString(),
  MONGO_PASS: ['dev', 'test'].includes(environment)
    ? env.get('MONGO_PASS').asString()
    : env.get('MONGO_PASS').required().asString(),
  POSTGRES_DB: env.get('POSTGRES_DB').required().asString(),
  POSTGRES_PASSWORD: ['dev', 'test'].includes(environment)
    ? env.get('POSTGRES_PASSWORD').asString()
    : env.get('POSTGRES_PASSWORD').required().asString(),
  POSTGRES_URL: env.get('POSTGRES_URL').required().asString(),
  POSTGRES_USER: ['dev', 'test'].includes(environment)
    ? env.get('POSTGRES_USER').asString()
    : env.get('POSTGRES_USER').required().asString(),
};

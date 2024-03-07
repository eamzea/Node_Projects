import { PrismaClient } from '@prisma/client';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log';
import { PostgresLogDataSource } from './postgres';

describe('postgres', () => {
  const postgresLDS = new PostgresLogDataSource();
  const logBase = new LogEntity({
    message: 'test-message',
    level: LogSeverityLevel.low,
    origin: 'test-postgres',
  });
  const consoleSpy = jest.spyOn(console, 'log');
  const prismaClient = new PrismaClient();

  beforeAll(async () => {
    await prismaClient.logModel.deleteMany()
  });

  afterAll(async () => {
    await prismaClient.logModel.deleteMany()
  });

  it('should saveLog correctly', async () => {
    await postgresLDS.saveLog(logBase);

    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should saveLog correctly', async () => {
    await postgresLDS.saveLog(logBase);
    const logs = await postgresLDS.getLogs(LogSeverityLevel.low);

    expect(logs).toHaveLength(2);
  });
});

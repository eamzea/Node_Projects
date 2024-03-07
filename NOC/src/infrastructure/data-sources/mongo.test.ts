import mongoose from 'mongoose';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log';
import { MongoLogDataSource } from './mongo';
import { MongoDataBase } from '../../data/mongoDB/init';
import { envs } from '../../config/plugins';
import { LogModel } from '../../data/mongoDB';

describe('mongo', () => {
  const mongoLDS = new MongoLogDataSource();
  const logBase = new LogEntity({
    message: 'test-message',
    level: LogSeverityLevel.low,
    origin: 'test-mongo',
  });
  const consoleSpy = jest.spyOn(console, 'log');

  beforeAll(async () => {
    await MongoDataBase.connect({
      dbName: envs.MONGO_DB_NAME,
      mongoUrl: envs.MONGO_URL,
    });

    await LogModel.deleteMany();
  });

  afterAll(async () => {
    await LogModel.deleteMany();
    mongoose.connection.close();
  });

  it('should saveLog correctly', async () => {
    await mongoLDS.saveLog(logBase);

    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should getLogs correctly', async () => {
    await mongoLDS.saveLog(logBase)
    const logs = await mongoLDS.getLogs(LogSeverityLevel.low);

    expect(logs).toHaveLength(2);
  });
});

import { envs } from '../../../config/plugins';
import { MongoDataBase } from '../init';
import mongoose from 'mongoose';
import { LogModel } from './log';

describe('log Model', () => {
  beforeAll(async () => {
    await MongoDataBase.connect({
      dbName: envs.MONGO_DB_NAME,
      mongoUrl: envs.MONGO_URL,
    });
  });

  afterAll(() => {
    mongoose.connection.close();
  });

  it('should return LogModel', async () => {
    const logData = {
      origin: 'log.model.test.ts',
      message: 'test-message',
      level: 'low',
    };

    const log = await LogModel.create(logData);

    expect(log).toEqual(
      expect.objectContaining({
        ...logData,
        id: expect.any(String),
        createdAt: expect.any(String),
      }),
    );

    await LogModel.findByIdAndDelete(log.id);
  });

  it('should return schema', () => {
    const schema = LogModel.schema.obj;

    expect(schema).toEqual(
      expect.objectContaining({
        message: { type: expect.any(Function), required: true },
        origin: { type: expect.any(Function) },
        level: {
          type: expect.any(Function),
          enum: ['low', 'medium', 'high'],
          default: 'low',
        },
        createdAt: { type: expect.any(Function), default: expect.any(Date) },
      }),
    );
  });
});

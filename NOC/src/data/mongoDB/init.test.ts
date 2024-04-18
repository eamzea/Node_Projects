import mongoose from 'mongoose';
import { MongoDataBase } from './init';

describe('init', () => {
  afterAll(() => {
    mongoose.connection.close();
  });

  afterEach(() => {
    mongoose.connection.close();
  });

  it('should connect to DB', async () => {
    const connected = await MongoDataBase.connect({
      dbName: process.env.MONGO_DB_NAME!,
      mongoUrl: process.env.MONGO_URL!,
    });

    expect(connected).toBe(true);
  });
  it('should connect to DB', async () => {
    try {
      await
        MongoDataBase.connect({
          dbName: process.env.MONGO_DB_NAME!,
          mongoUrl: 'mongodb://user:password@localhost:27017sadasd/',
        });
    } catch (error) {
    }
  });
});

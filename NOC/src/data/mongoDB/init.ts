import mongoose from 'mongoose';

interface ConnectionOptions {
  mongoUrl: string;
  dbName: string;
}

export class MongoDataBase {
  static async connect(options: ConnectionOptions) {
    const { mongoUrl, dbName } = options;
    try {
      await mongoose.connect(mongoUrl, {
        dbName,
      });
    } catch (error) {
      console.log('Error trying to connect to mongo')
      throw error
    }
  }
}

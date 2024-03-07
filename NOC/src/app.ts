import { envs } from './config/plugins';
import { MongoDataBase } from './data/mongoDB';
import { Server } from './presentation/server';

(() => {
  main();
})();

async function main() {
  try {
    await MongoDataBase.connect({
      mongoUrl: envs.MONGO_URL,
      dbName: envs.MONGO_DB_NAME,
    });
  } catch (error) {
    console.log(error)
  }

  Server.start();
}

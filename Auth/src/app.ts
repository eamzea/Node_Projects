import { MongoDataBase } from './config/data';
import { envs } from './config';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';

(async () => {
  main();
})();

async function main() {

  await MongoDataBase.connect({
    mongoUrl: envs.MONGO_URL,
    dbName: envs.DB_NAME
  });

  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  });

  server.start();
}

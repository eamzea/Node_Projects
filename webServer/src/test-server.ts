import { envs } from './config/envs';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';

export const testServer = new Server({
  port: envs.PORT,
  routes: AppRoutes.routes,
});

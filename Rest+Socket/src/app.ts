import { createServer } from 'http';
import { envs } from './config';
import { AppRoutes, Server } from './presentation';
import { WssService } from './presentation/services';

(async () => {
  main();
})();

function main() {
  const server = new Server({
    port: envs.PORT,
  });

  const httpServer = createServer(server.app)

  WssService.initWss({
    server: httpServer
  })

  server.setRoutes(AppRoutes.routes)

  httpServer.listen(envs.PORT, () => {
    console.log(`Server running on port: ${envs.PORT}`)
  })
}

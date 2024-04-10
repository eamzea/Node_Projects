import express, { Router } from 'express';
import path from 'path';
import compression from 'compression'

interface Options {
  port: number;
  routes: Router;
}

export class Server {
  private app = express();
  private readonly port: number;
  private readonly routes: Router;

  constructor(options: Options) {
    const { port, routes } = options;

    this.port = port;
    this.routes = routes;
  }

  async start() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static('public'));
    this.app.use(compression())

    this.app.use(this.routes);
    this.app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname + `../../../public/index.html`));
    });

    this.app.listen(this.port, () => {
      console.log(`Server is running at  http://localhost:${this.port}`);
    });
  }
}

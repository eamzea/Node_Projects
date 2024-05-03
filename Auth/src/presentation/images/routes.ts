import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { TypeMiddleware } from '../middlewares/type.middleware';
import { ImagesController } from './controller';

export class ImagesRoutes {
  static get routes(): Router {
    const router = Router();

    const controller = new ImagesController()

    router.use([
      AuthMiddleware.validateJWT,
      TypeMiddleware.validTypes(['users', 'products', 'categories'], 1),
    ]);

    router.get('/:type/:image', controller.getImage);

    return router;
  }
}

import { Router } from 'express';
import { TodoController } from './controller';
import { TodoDSImpl } from '../../infrastructure/datasource';
import { TodoRepoImpl } from '../../infrastructure/repositories';

export class TodoRoutes {
  static get routes(): Router {
    const router = Router();
    const datasource = new TodoDSImpl();
    const todoRepository = new TodoRepoImpl(datasource);
    const todoController = new TodoController(todoRepository);

    router.get('/', todoController.getTodos);
    router.post('/', todoController.createTodo);
    router.get('/:id', todoController.getTodoById);
    router.put('/:id', todoController.updateTodo);
    router.delete('/:id', todoController.deleteTodo);

    return router;
  }
}

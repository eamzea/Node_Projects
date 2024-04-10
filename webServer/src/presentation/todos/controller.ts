import { Response, Request } from 'express';
import { CreateTodoDto, UpdateTodoDto } from '../../domain/dtos';
import { TodoRepository } from '../../domain/repositories';
import { CreateTodo, DeleteTodo, GetTodo, GetTodos, UpdateTodo } from '../../domain/use-cases/todo';

export class TodoController {
  constructor(private readonly todoRepository: TodoRepository) {}

  public getTodos(req: Request, res: Response) {
    new GetTodos(this.todoRepository)
      .execute()
      .then(todos => res.json(todos))
      .catch(error => res.status(400).json({ error }));
  }

  public getTodoById(req: Request, res: Response) {
    const todoId = req.params.id;

    new GetTodo(this.todoRepository)
      .execute(+todoId)
      .then(todo => res.json(todo))
      .catch(error => res.status(400).json({ error }));
  }

  public createTodo(req: Request, res: Response) {
    const [error, createTodoDto] = CreateTodoDto.create(req.body);

    if (error) {
      return res.status(400).json({ error });
    }

    new CreateTodo(this.todoRepository)
      .execute(createTodoDto!)
      .then(todo => res.json(todo))
      .catch(error => res.status(400).json({ error }));
  }

  public updateTodo(req: Request, res: Response) {
    const id = +req.params.id;
    const [error, updateTodoDto] = UpdateTodoDto.update({ ...req.body, id });

    if (error) {
      return res.status(400).json({ error });
    }

    new UpdateTodo(this.todoRepository)
      .execute(updateTodoDto!)
      .then(todo => res.json(todo))
      .catch(error => res.status(400).json({ error }));
  }

  public deleteTodo(req: Request, res: Response) {
    const todoId = req.params.id;

    new DeleteTodo(this.todoRepository)
      .execute(+todoId)
      .then(todo => res.json(todo))
      .catch(error => res.status(400).json({ error }));
  }
}

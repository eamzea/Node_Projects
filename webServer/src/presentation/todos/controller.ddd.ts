import { Response, Request } from 'express';
import { CreateTodoDto, UpdateTodoDto } from '../../domain/dtos';
import { TodoRepository } from '../../domain/repositories';

export class TodoController {
  constructor(private readonly todoRepository: TodoRepository) {}

  public async getTodos(req: Request, res: Response) {
    const todos = await this.todoRepository.getAll();

    res.json(todos);
  }

  public async getTodoById(req: Request, res: Response) {
    const todoId = req.params.id;

    try {
      const todo = await this.todoRepository.findById(+todoId);

      res.json(todo);
    } catch (error) {
      res.status(400).json(error);
    }
  }

  public async createTodo(req: Request, res: Response) {
    const [error, createTodoDto] = CreateTodoDto.create(req.body);

    if (error) {
      return res.status(400).json({ error });
    }

    const todo = await this.todoRepository.create(createTodoDto!);

    res.status(200).json({
      message: 'Todo created successfully',
      data: todo,
    });
  }

  public async updateTodo(req: Request, res: Response) {
    const id = +req.params.id;
    const [error, updateTodoDto] = UpdateTodoDto.update({ ...req.body, id });

    if (error) {
      return res.status(400).json({ error });
    }

    const updatedTodo = await this.todoRepository.updateById(updateTodoDto!);

    res.status(200).json({
      message: 'Todo updated successfully',
      data: updatedTodo,
    });
  }

  public async deleteTodo(req: Request, res: Response) {
    const todoId = req.params.id;
    const deleted = await this.todoRepository.deleteById(+todoId);

    res.status(200).json({
      message: 'Todo deleted successfully',
      data: deleted,
    });
  }
}

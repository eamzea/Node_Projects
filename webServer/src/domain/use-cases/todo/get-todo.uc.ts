import { TodoEntity } from '../../entities';
import { TodoRepository } from '../../repositories';

export interface GetTodoUC {
  execute(id: number): Promise<TodoEntity>;
}

export class GetTodo implements GetTodoUC {
  constructor(private readonly repository: TodoRepository) {}

  execute(id: number): Promise<TodoEntity> {
    return this.repository.findById(id);
  }
}

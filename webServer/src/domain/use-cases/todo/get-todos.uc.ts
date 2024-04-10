import { TodoEntity } from '../../entities';
import { TodoRepository } from '../../repositories';

export interface GetTodosUC {
  execute(): Promise<TodoEntity[]>;
}

export class GetTodos implements GetTodosUC {
  constructor(private readonly repository: TodoRepository) {}

  execute(): Promise<TodoEntity[]> {
    return this.repository.getAll();
  }
}

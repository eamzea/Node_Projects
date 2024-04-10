import { TodoEntity } from '../../entities';
import { TodoRepository } from '../../repositories';

export interface DeleteTodoUC {
  execute(id: number): Promise<TodoEntity>;
}

export class DeleteTodo implements DeleteTodoUC {
  constructor(private readonly repository: TodoRepository) {}

  execute(id: number): Promise<TodoEntity> {
    return this.repository.deleteById(id);
  }
}

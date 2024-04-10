import { UpdateTodoDto } from '../../dtos';
import { TodoEntity } from '../../entities';
import { TodoRepository } from '../../repositories';

export interface UpdateTodoUC {
  execute(dto: UpdateTodoDto): Promise<TodoEntity>;
}

export class UpdateTodo implements UpdateTodoUC {
  constructor(private readonly repository: TodoRepository) {}

  execute(dto: UpdateTodoDto): Promise<TodoEntity> {
    return this.repository.updateById(dto);
  }
}

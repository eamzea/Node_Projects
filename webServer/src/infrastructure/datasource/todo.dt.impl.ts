import { prisma } from '../../data/postgres';
import { TodoDataSource } from '../../domain/datasources';
import { CreateTodoDto, UpdateTodoDto } from '../../domain/dtos';
import { TodoEntity } from '../../domain/entities';

export class TodoDSImpl implements TodoDataSource {
  async create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
    const todo = await prisma.todo.create({
      data: createTodoDto!,
    });

    return TodoEntity.fromDB(todo);
  }

  async getAll(): Promise<TodoEntity[]> {
    const todos = await prisma.todo.findMany();

    return todos.map(todo => TodoEntity.fromDB(todo));
  }

  async findById(id: number): Promise<TodoEntity> {
    const todo = await prisma.todo.findFirst({ where: { id } });

    if (!todo) {
      throw `Todo with id:${id} not found`;
    }

    return TodoEntity.fromDB(todo);
  }
  async updateById(updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
    await this.findById(updateTodoDto.id!);

    const updatedTodo = await prisma.todo.update({
      where: { id: updateTodoDto.id },
      data: updateTodoDto!.values,
    });

    return TodoEntity.fromDB(updatedTodo);
  }

  async deleteById(id: number): Promise<TodoEntity> {
    await this.findById(id);
    const deleted = await prisma.todo.delete({ where: { id } });

    return TodoEntity.fromDB(deleted);
  }
}

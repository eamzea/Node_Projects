import request from 'supertest';
import { testServer } from '../test-server';
import { prisma } from '../data/postgres';

const todos = [
  {
    text: 'test todo 1',
  },
  {
    text: 'test todo 2',
  },
];

describe('Todo Routes', () => {
  beforeAll(async () => {
    await testServer.start();
  });

  afterAll(() => {
    testServer.close();
  });

  afterEach(async () => {
    await prisma.todo.deleteMany()
  })

  describe('get Todos', () => {
    it('should return todos', async () => {
      await prisma.todo.createMany({
        data: todos,
      });

      const { body } = await request(testServer.app).get('/api/todos').expect(200);

      expect(body).toHaveLength(2);
      expect(body[0].text).toBe(todos[0].text);
      expect(body[1].text).toBe(todos[1].text);
    });
  })

  describe('get a Todo', () => {
    it('should return a todo', async () => {
      const todo = await prisma.todo.create({
        data: todos[0],
      });

      const { body } = await request(testServer.app).get(`/api/todos/${todo.id}`).expect(200);

      expect(body.id).toEqual(todo.id);
      expect(body.text).toEqual(todo.text);
    });

    it('should failed on return a todo', async () => {
      const { body } = await request(testServer.app).get(`/api/todos/${-1}`).expect(404);

      expect(body).toStrictEqual({ error: 'Todo with id:-1 not found' });
    });
  });

  describe('createTodo', () => {
    it('should create a todo', async () => {
      const { body } = await request(testServer.app).post(`/api/todos`).send(todos[0]).expect(201);

      expect(body).toEqual({
        id: expect.any(Number),
        text: todos[0].text,
        completedAt: null
      });
    })

    it('should not create a todo', async () => {
      const { body } = await request(testServer.app)
        .post(`/api/todos`)
        .send({
          ...todos[0],
          text: ''
        })
        .expect(400);

      expect(body).toEqual({
        error: 'Text is required'
      });
    })
  })

  describe('updateTodo', () => {
    it('should update a todo', async () => {
      const todo = await prisma.todo.create({
        data: todos[0],
      });

      const { body } = await request(testServer.app).put(`/api/todos/${todo.id}`).send({
        text: 'new test text'
      }).expect(200);

      expect(body).toEqual({
        id: expect.any(Number),
        text: 'new test text',
        completedAt: null,
      });
    })

    it('should not update if there is not a valid todo', async () => {
      const { body } = await request(testServer.app)
        .put(`/api/todos/-1`)
        .send({
          text: 'new test text',
        })
        .expect(404);

      expect(body).toEqual({ error: 'Todo with id:-1 not found' });
    })

    it('should not update a todo', async () => {
      const { body } = await request(testServer.app)
        .put(`/api/todos/g`)
        .send({
          text: 'new test text',
        })
        .expect(400);

      expect(body).toEqual({
        error: 'Invalid ID'
      });
    })
  })

  describe('deleteTodo', () => {
    it('should delete a todo', async () => {
      const todo = await prisma.todo.create({
        data: todos[0],
      });

      const { body } = await request(testServer.app).delete(`/api/todos/${todo.id}`).expect(200);

      expect(body).toEqual({
        id: expect.any(Number),
        text: todos[0].text,
        completedAt: null,
      });
    })

    it('should not delete a todo', async () => {
      const { body } = await request(testServer.app)
        .put(`/api/todos/g`)
        .send({
          text: 'new test text',
        })
        .expect(400);

      expect(body).toEqual({
        error: 'Invalid ID'
      });
    })
  })
});

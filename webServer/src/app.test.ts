
import { envs } from './config/envs';
import { Server } from './presentation/server';

jest.mock('../src/presentation/server');

describe('should call server with arguments and start', () => {
  test('should work', async () => {
    await import('./app');

    expect(Server).toHaveBeenCalledTimes(1);
    expect(Server).toHaveBeenCalledWith({
      port: envs.PORT,
      routes: expect.any(Function),
    });

    expect(Server.prototype.start).toHaveBeenCalledWith();
  });
});

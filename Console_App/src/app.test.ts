import { ServerApp } from './presentation/server-app';
describe('APP', () => {
  it('should call Server.run with values', async () => {
    const serverMock = jest.fn();
    ServerApp.run = serverMock;
    process.argv = ['node', 'app.ts', '-b', '2', '-l', '2', '-s', '-n', 'testName', '-d', 'testDestination']

    await import('./app')

    expect(serverMock).toHaveBeenCalledWith({
      'base': 2,
      'limit': 2,
      'showTable': true,
      'name': 'testName',
      'destination': 'testDestination'
    })

  })
})

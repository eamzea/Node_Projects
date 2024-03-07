import { CheckService } from './check';
import { LogEntity } from '../../entities/log';

describe('CheckService', () => {
  const logRepositoryMock = {
    saveLog: jest.fn(),
    getLogs: jest.fn(),
  };
  const successCallbackMock = jest.fn();
  const errorCallbackMock = jest.fn();
  let fetchMock = jest.spyOn(global, 'fetch');

  beforeEach(() => {
    fetchMock.mockImplementation(() => ({ ok: true } as unknown as Promise<Response>));
  });

  afterEach(() => {
    jest.clearAllMocks()
  })

  const check = new CheckService(logRepositoryMock, successCallbackMock, errorCallbackMock);

  it('should run correctly', () => {
    expect(check).toBeInstanceOf(CheckService);
  });

  it('should execute request successfully', async () => {
    const result = await check.execute('test-url');

    expect(result).toBe(true);
    expect(logRepositoryMock.saveLog).toHaveBeenCalled();
    expect(logRepositoryMock.saveLog).toHaveBeenCalledWith(expect.any(LogEntity));
    expect(successCallbackMock).toHaveBeenCalled();
    expect(successCallbackMock).toHaveBeenCalledWith('Service: test-url is ok');
    expect(errorCallbackMock).not.toHaveBeenCalled();
  });

  it('should throw error', async () => {
    fetchMock
      .mockImplementation(() => ({ ok: false } as unknown as Promise<Response>));
    const result = await check.execute('test-url');

    expect(result).toBe(false);
    expect(successCallbackMock).not.toHaveBeenCalled();
    expect(errorCallbackMock).toHaveBeenCalled();
    expect(logRepositoryMock.saveLog).toHaveBeenCalledWith(expect.any(LogEntity));
  });
});

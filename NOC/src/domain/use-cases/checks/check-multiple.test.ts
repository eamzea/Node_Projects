import { CheckServiceMultiple } from "./check-multiple";
import { LogEntity } from '../../entities/log';

describe('CheckMultiple', () => {
  const logRepositoryMock1 = {
    saveLog: jest.fn(),
    getLogs: jest.fn(),
  };
  const logRepositoryMock2 = {
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
    jest.clearAllMocks();
  });

  const check = new CheckServiceMultiple(
    [logRepositoryMock1, logRepositoryMock2],
    successCallbackMock,
    errorCallbackMock,
  );

  it('should run correctly', () => {
    expect(check).toBeInstanceOf(CheckServiceMultiple);
  });

  it('should execute request successfully', async () => {
    const result = await check.execute('test-url');

    expect(result).toBe(true);
    expect(logRepositoryMock1.saveLog).toHaveBeenCalled();
    expect(logRepositoryMock1.saveLog).toHaveBeenCalledWith(expect.any(LogEntity));
    expect(logRepositoryMock2.saveLog).toHaveBeenCalled();
    expect(logRepositoryMock2.saveLog).toHaveBeenCalledWith(expect.any(LogEntity));
    expect(successCallbackMock).toHaveBeenCalled();
    expect(successCallbackMock).toHaveBeenCalledWith('Service: test-url is ok');
    expect(errorCallbackMock).not.toHaveBeenCalled();
  });

  it('should throw error', async () => {
    fetchMock.mockImplementation(() => ({ ok: false } as unknown as Promise<Response>));
    const result = await check.execute('test-url');

    expect(result).toBe(false);
    expect(successCallbackMock).not.toHaveBeenCalled();
    expect(errorCallbackMock).toHaveBeenCalled();
    expect(logRepositoryMock1.saveLog).toHaveBeenCalledWith(expect.any(LogEntity));
    expect(logRepositoryMock2.saveLog).toHaveBeenCalledWith(expect.any(LogEntity));
  });
})

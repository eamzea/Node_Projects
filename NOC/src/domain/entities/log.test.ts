import { LogEntity, LogSeverityLevel } from './log';

describe('LogEntity', () => {
  const logBase = {
    message: 'test-message',
    level: LogSeverityLevel.low,
    origin: 'test',
  };

  const jsonLogBase = {
    message: 'Service https://www.google.com is working',
    level: 'low',
    createdAt: '2024-02-26T19:39:40.482Z',
    origin: 'domain/use-cases-checks/check.ts',
  };

  it('should create a LogEntity instance', () => {
    const log = new LogEntity(logBase);

    expect(log).toBeInstanceOf(LogEntity);
    expect(log.message).toBe(logBase.message);
    expect(log.level).toBe(logBase.level);
    expect(log.origin).toBe(logBase.origin);
    expect(log.createdAt).toBeInstanceOf(Date);
  });

  it('should create instance from JSON', () => {
    const log = LogEntity.fromJson(JSON.stringify(jsonLogBase));

    expect(log).toBeInstanceOf(LogEntity);
    expect(log.message).toBe(jsonLogBase.message);
    expect(log.level).toBe(jsonLogBase.level);
    expect(log.origin).toBe(jsonLogBase.origin);
    expect(log.createdAt).toBeInstanceOf(Date);
  });

  it('should not create instance from empty JSON', () => {

    expect(() => {
      LogEntity.fromJson('');
    }).toThrow('Missing information in this log {}');
  });

  it('should create instance from Object', () => {
    const log = LogEntity.fromObject(logBase);

    expect(log).toBeInstanceOf(LogEntity);
    expect(log.message).toBe(logBase.message);
    expect(log.level).toBe(logBase.level);
    expect(log.origin).toBe(logBase.origin);
    expect(log.createdAt).toBeInstanceOf(Date);
  });
});

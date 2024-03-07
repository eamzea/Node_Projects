import { LogEntity, LogSeverityLevel } from '../../domain/entities/log';
import { LogRepositoryImplementation } from './log';

describe('log', () => {
  const logDS = {
    saveLog: jest.fn(),
    getLogs: jest.fn(),
  };
  const logRI = new LogRepositoryImplementation(logDS);
  const logBase = new LogEntity({
    message: 'test-message',
    level: LogSeverityLevel.low,
    origin: 'test-mongo',
  });

  it('should saveLog', async () => {
    await logRI.saveLog(logBase);

    expect(logDS.saveLog).toHaveBeenCalled();
  });

  it('should getLogs', async () => {
    await logRI.getLogs(LogSeverityLevel.low);

    expect(logDS.getLogs).toHaveBeenCalled();
  });
});

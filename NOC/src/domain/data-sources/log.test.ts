import { LogEntity, LogSeverityLevel } from "../entities/log"
import { LogDataSource } from "./log"

describe('log', () => {
  const newLog = new LogEntity({
    message: 'test-message',
    level: LogSeverityLevel.low,
    origin: 'test-origin'
  })

  class MockLogDataSource implements LogDataSource {
    async saveLog(log: LogEntity): Promise<void> {
      return;
    }
    async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
      return [newLog]
    }

  }

  it('should test the abstract class', async () => {
    const log = new MockLogDataSource();

    expect(log).toBeInstanceOf(MockLogDataSource);
    expect(log).toHaveProperty('saveLog');
    expect(log).toHaveProperty('getLogs');


  })
})

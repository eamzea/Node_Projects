import { LogEntity, LogSeverityLevel } from '../../entities/log';
import { LogRepository } from '../../repository/log';

interface CheckServiceMultipleUseCase {
  execute(url: string): Promise<boolean>;
}

type SuccessCallback = (success: string) => void;
type ErrorCallback = (error: string) => void;

export class CheckServiceMultiple implements CheckServiceMultipleUseCase {
  constructor(
    private readonly logRepositories: LogRepository[],
    private readonly successCallback: SuccessCallback,
    private readonly errorCallback: ErrorCallback,
  ) { }

  private callLogs(log: LogEntity) {
    this.logRepositories.forEach(logRepository => {
      logRepository.saveLog(log)
    })
  }

  public async execute(url: string): Promise<boolean> {
    try {
      const req = await fetch(url);

      if (!req.ok) {
        throw new Error(`Error checking service ${url}`);
      }

      const log = new LogEntity({
        message: `Service ${url} is working`,
        level: LogSeverityLevel.low,
        origin: 'domain/use-cases-checks/check.ts',
      });

      this.callLogs(log);
      this.successCallback(`Service: ${url} is ok`);

      return req.ok;
    } catch (error) {
      const errorMessage = `Service ${url} ${error}`;
      const log = new LogEntity({
        message: errorMessage,
        level: LogSeverityLevel.high,
        origin: 'domain/use-cases-checks/check.ts',
      });
      this.callLogs(log);
      this.errorCallback(errorMessage);

      return false;
    }
  }
}

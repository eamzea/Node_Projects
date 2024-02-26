import { LogEntity, LogSeverityLevel } from '../../domain/entities/log';
import { LogRepository } from '../../domain/repository/log';
import { LogDataSource } from '../../domain/data-sources/log';

export class LogRepositoryImplementation implements LogRepository {
  constructor(private readonly logDataSource: LogDataSource) {}

  async saveLog(log: LogEntity): Promise<void> {
    return this.logDataSource.saveLog(log)
  }
  async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
    return this.logDataSource.getLogs(severityLevel)
  }
}

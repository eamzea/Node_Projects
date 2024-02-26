import { LogDataSource } from "../../domain/data-sources/log";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log";
import fs from 'fs';

export class FileSystemDataSource implements LogDataSource {
  private readonly logPath = 'logs/'
  private readonly lowLogsPath = 'logs/low-logs.log'
  private readonly mediumLogsPath = 'logs/medium-logs.log'
  private readonly highLogsPath = 'logs/high-logs.log'

  constructor() {
    this.createLogFiles()
  }

  private createLogFiles = () => {
    if (!fs.existsSync(this.logPath)) {
      fs.mkdirSync(this.logPath);
    }
    const allPaths = [
      this.lowLogsPath,
      this.mediumLogsPath,
      this.highLogsPath
    ]

    allPaths.forEach(path => {
      if (!fs.existsSync(path)) {
        fs.writeFileSync(path, '')
      }
    })
  }

  async saveLog(newLog: LogEntity): Promise<void> {
    const logAsJSON = `${JSON.stringify(newLog)}\n`;

    fs.appendFileSync(`logs/${newLog.level}-logs.log`, logAsJSON)
  }

  private getLogsFromFile = (path: string): LogEntity[] => {
    const content = fs.readFileSync(path, 'utf-8');
    const logs = content.split('\n').map(LogEntity.createFromJson)

    return logs

  }

  async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
    switch (severityLevel) {
      case LogSeverityLevel.low:
        return this.getLogsFromFile(this.lowLogsPath)
      case LogSeverityLevel.medium:
        return this.getLogsFromFile(this.mediumLogsPath)
      case LogSeverityLevel.high:
        return this.getLogsFromFile(this.highLogsPath)
      default:
        throw new Error (`Level ${severityLevel} not implemented`)
    }
  }

}

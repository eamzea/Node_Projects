export enum LogSeverityLevel {
  low = 'low',
  medium = 'medium',
  high = 'high',
}

export interface LogEntityOptions {
  message: string;
  level: LogSeverityLevel;
  origin: string;
  createdAt?: Date;
}

export class LogEntity {
  public level: LogSeverityLevel;
  public message: string;
  public createdAt: Date;
  public origin: string;

  constructor({ message, level, origin, createdAt = new Date() }: LogEntityOptions) {
    this.message = message;
    this.level = level;
    this.createdAt = createdAt;
    this.origin = origin;
  }

  static createFromJson = (json: string): LogEntity => {
    const { message, level, createdAt, origin } = JSON.parse(json);

    if (!message || !level) {
      throw new Error(`Missing information in this log ${json}`);
    }

    const newLog = new LogEntity({ message, level, createdAt, origin });
    newLog.createdAt = new Date(createdAt);

    return newLog;
  };
}

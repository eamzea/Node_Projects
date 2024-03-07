import { PrismaClient, SeverityLevel } from '@prisma/client';
import { LogDataSource } from '../../domain/data-sources/log';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log';

const prismaClient = new PrismaClient();

const severityEnum = {
  LOW: LogSeverityLevel.low,
  MEDIUM: LogSeverityLevel.medium,
  HIGH: LogSeverityLevel.high,
};

export class PostgresLogDataSource implements LogDataSource {
  async saveLog(log: LogEntity): Promise<void> {
    const level = severityEnum[log.level];

    const newLog = await prismaClient.logModel.create({
      data: {
        ...log,
        level: level as unknown as SeverityLevel,
      },
    });
  }

  async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
    const level = severityEnum[severityLevel];

    const logs = await prismaClient.logModel.findMany({
      where: { level: level as unknown as SeverityLevel },
    });

    return logs.map(LogEntity.fromObject)
  }
}

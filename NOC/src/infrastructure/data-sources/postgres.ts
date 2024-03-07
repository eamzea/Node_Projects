import { PrismaClient, SeverityLevel } from '@prisma/client';
import { LogDataSource } from '../../domain/data-sources/log';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log';

const prismaClient = new PrismaClient();

const severityEnum = {
  low: LogSeverityLevel.low,
  medium: LogSeverityLevel.medium,
  high: LogSeverityLevel.high,
};

export class PostgresLogDataSource implements LogDataSource {
  async saveLog(log: LogEntity): Promise<void> {
    const level = severityEnum[log.level];

    try {
      const newLog = await prismaClient.logModel.create({
        data: {
          ...log,
          level: level as unknown as SeverityLevel,
        },
      });

      console.log(`Postgres Log created: ${newLog.id}`);
    } catch (error) {
      console.log(error);
    }
  }

  async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
    const level = severityEnum[severityLevel];

    const logs = await prismaClient.logModel.findMany({
      where: { level: level as unknown as SeverityLevel },
    });

    return logs.map(LogEntity.fromObject);
  }
}

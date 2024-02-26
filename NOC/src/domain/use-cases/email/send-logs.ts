import { EmailService } from '../../../presentation/email/email';
import { LogEntity, LogSeverityLevel } from '../../entities/log';
import { LogRepository } from '../../repository/log';

interface SendLogEmailUseCase {
  execute: (to: string | string[]) => Promise<boolean>;
}

export class SendEmailLogs implements SendLogEmailUseCase {
  constructor(
    private readonly emailService: EmailService,
    private readonly logRepository: LogRepository,
  ) {}

  async execute(to: string | string[]) {
    try {
      const sent = await this.emailService.sendEmailWithFileSystemLogs(to);

      if (!sent) throw new Error('Failed to send logs by e-mail');

      const log = new LogEntity({
        message: `Mail sent successfully`,
        level: LogSeverityLevel.low,
        origin: 'domain/use-cases/email/send-logs',
      });
      this.logRepository.saveLog(log);

      return true;
    } catch (error) {
      const log = new LogEntity({
        message: `Error on sending logs by email: ${error}`,
        level: LogSeverityLevel.high,
        origin: 'domain/use-cases/email/send-logs',
      });
      this.logRepository.saveLog(log);

      return false;
    }
  }
}

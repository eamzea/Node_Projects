import { CheckService } from '../domain/use-cases/checks/check';
import { CheckServiceMultiple } from '../domain/use-cases/checks/check-multiple';
import { SendEmailLogs } from '../domain/use-cases/email/send-logs';
import { FileSystemDataSource } from '../infrastructure/data-sources/file-system';
import { MongoLogDataSource } from '../infrastructure/data-sources/mongo';
import { PostgresLogDataSource } from '../infrastructure/data-sources/postgres';
import { LogRepositoryImplementation } from '../infrastructure/repositories/log';
import { CronService } from './cron/cronJob';
import { EmailService } from './email/email';

const fileSystemLogRepository = new LogRepositoryImplementation(new FileSystemDataSource());
const mongoLogRepository = new LogRepositoryImplementation(new MongoLogDataSource());
const postgresLogRepository = new LogRepositoryImplementation(new PostgresLogDataSource());
const emailService = new EmailService();

export class Server {
  public static start() {
    console.log('Server started...');

    // new SendEmailLogs(
    //   emailService,
    //   fileSystemLogRepository
    // )

    // emailService.sendEmail({
    //   to: 'm.zea@live.com.mx',
    //   subject: 'Testing',
    //   htmlBody: `
    //   <h1>Hello World!</h1>
    //   `
    // })

    CronService.createJob('*/20 * * * * *', () => {
      new CheckServiceMultiple(
        [fileSystemLogRepository, mongoLogRepository, postgresLogRepository],
        msg => console.log(msg),
        error => console.log(error),
      ).execute('https://www.google.com');
    });
  }
}

import { CheckService } from '../domain/use-cases/checks/check';
import { SendEmailLogs } from '../domain/use-cases/email/send-logs';
import { FileSystemDataSource } from '../infrastructure/data-sources/file-system';
import { LogRepositoryImplementation } from '../infrastructure/repositories/log';
import { CronService } from './cron/cronJob';
import { EmailService } from './email/email';

const fileSystemLogRepository = new LogRepositoryImplementation(new FileSystemDataSource());
const emailService = new EmailService();

export class Server {
  public static start() {
    console.log('Server started...');

    new SendEmailLogs(
      emailService,
      fileSystemLogRepository
    )

    emailService.sendEmail({
      to: 'm.zea@live.com.mx',
      subject: 'Testing',
      htmlBody: `
      <h1>Hello World!</h1>
      `
    })

    // CronService.createJob('*/20 * * * * *', () => {
    //   new CheckService(
    //     fileSystemLogRepository,
    //     msg => console.log(msg),
    //     error => console.log(error),
    //   ).execute('https://localhost:3000');
    // });
  }
}

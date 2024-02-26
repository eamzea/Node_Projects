import nodemailer from 'nodemailer';
import { envs } from '../../config/plugins';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log';
import { LogRepository } from '../../domain/repository/log';

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachments?: Attachment[]
}

interface Attachment {
  filename: string;
  path: string;
}

export class EmailService {
  private transporter = nodemailer.createTransport({
    service: envs.MAILER_SERVICE,
    auth: {
      user: envs.MAILER_EMAIL,
      pass: envs.MAILER_SECRET_KEY,
    },
  });

  constructor(
  ){}

  async sendEmail(options: SendEmailOptions) {
    const { to, subject, htmlBody, attachments = [] } = options;

    try {
      const sentData = await this.transporter.sendMail({
        to,
        subject,
        html: htmlBody,
        attachments
      });

      return true;
    } catch (error) {

      return false;
    }
  }

  async sendEmailWithFileSystemLogs(to: string | string[]) {
    const subject = '';
    const htmlBody = ``;

    const attachments: Attachment[] = [
      {
        filename: 'low-logs.log', path: './logs/low-logs.log'
      },
      {
        filename: 'medium-logs.log', path: './logs/medium-logs.log'
      },
      {
        filename: 'high-logs.log', path: './logs/high-logs.log'
      },
    ]

    return this.sendEmail({
      to,
      subject,
      htmlBody,
      attachments
    })
  }

}

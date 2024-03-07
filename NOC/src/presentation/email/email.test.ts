import { EmailService, SendEmailOptions } from './email';
import nodemailer from 'nodemailer';

describe('email', () => {
  const mockSendMail = jest.fn();

  nodemailer.createTransport = jest.fn().mockReturnValue({
    sendMail: mockSendMail,
  });
  const emailService = new EmailService();
  const options: SendEmailOptions = {
    to: 'test-email',
    subject: 'test-subject',
    htmlBody: 'test-htmlBody',
  };

  it('should sendEmail', async () => {
    await emailService.sendEmail(options);

    expect(mockSendMail).toHaveBeenCalled();
  });

  it('should sendEmailWithFileSystemLogs', async () => {
    await emailService.sendEmailWithFileSystemLogs(options.to);

    expect(mockSendMail).toHaveBeenCalled();
  });
});

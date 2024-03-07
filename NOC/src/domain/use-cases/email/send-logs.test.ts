import { EmailService } from '../../../presentation/email/email';
import { LogRepository } from '../../repository/log';
import { SendEmailLogs } from './send-logs';

describe('SendEmailLogs', () => {
  const emailServiceMock = {
    sendEmailWithFileSystemLogs: jest.fn().mockReturnValue(true),
  };
  const logRepositoryMock: LogRepository = {
    saveLog: jest.fn(),
    getLogs: jest.fn(),
  };
  const sender = new SendEmailLogs(emailServiceMock as unknown as EmailService, logRepositoryMock);

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should send email', async () => {
    const result = await sender.execute('test-email');

    expect(result).toBe(true);
    expect(emailServiceMock.sendEmailWithFileSystemLogs).toHaveBeenCalled();
    expect(logRepositoryMock.saveLog).toHaveBeenCalled();
  });

  it('should throw an error', async () => {
    emailServiceMock.sendEmailWithFileSystemLogs.mockReturnValue(false);
    const result = await sender.execute('test-email');

    expect(result).toBe(false);
    expect(logRepositoryMock.saveLog).toHaveBeenCalled();
  });
});

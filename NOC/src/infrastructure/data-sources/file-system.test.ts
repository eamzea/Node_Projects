import fs from 'fs';
import path from 'path';
import { FileSystemDataSource } from './file-system';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log';

describe('file-system', () => {
  const logPath = path.join(__dirname, '../../../logs/');
  const logBase = new LogEntity({
    message: 'test-message',
    level: LogSeverityLevel.low,
    origin: 'test-fileSystem',
  });

  beforeEach(() => {
    fs.rmSync(logPath, { recursive: true, force: true });
  });

  it('should create log if they do not exist', () => {
    new FileSystemDataSource();

    const files = fs.readdirSync(logPath);

    expect(files).toEqual(['high-logs.log', 'low-logs.log', 'medium-logs.log']);
  });

  it('should save a log', () => {
    const logDS = new FileSystemDataSource();
    logDS.saveLog(logBase);

    const lowLogs = fs.readFileSync(`${logPath}/low-logs.log`, 'utf8');

    expect(lowLogs).toContain(JSON.stringify(logBase));
  });

  it('should get logs', async () => {
    const logDS = new FileSystemDataSource();
    await logDS.saveLog(logBase);

    const lowLogs = await logDS.getLogs(LogSeverityLevel.low);

    expect(lowLogs).toHaveLength(1);
  });
});

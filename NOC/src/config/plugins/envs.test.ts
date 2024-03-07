import { envs } from './envs';

describe('envs.ts', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should return env options', () => {
    expect(envs).toEqual({
      MAILER_EMAIL: 'help@zinns.io',
      MAILER_SECRET_KEY: 'rwgptmyzgsscqaao',
      MAILER_SERVICE: 'gmail',
      MONGO_DB_NAME: 'noc_test',
      MONGO_PASS: '',
      MONGO_URL: 'mongodb://localhost:27017/noc_test',
      MONGO_USER: '',
      PORT: 3000,
      POSTGRES_DB: 'noc_test',
      POSTGRES_PASSWORD: '',
      POSTGRES_URL: 'postgresql://edgarzea:@localhost:5432/noc_test',
      POSTGRES_USER: 'edgarzea',
    });
  });

  it('should return an error', async () => {
    process.env.PORT = 'PORT';

    try {
      await import('./envs');
    } catch (error) {
      expect(`${error}`).toContain('"PORT" should be a valid integer');
    }
  });
});

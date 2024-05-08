import { Request, Response } from 'express';
import { GitHubService, DiscordService } from '../services';

export class GitHubController {
  constructor(
    private readonly githubService = new GitHubService(),
    private readonly discordService = new DiscordService(),
  ) {}

  webHookHandler = (req: Request, res: Response) => {
    const githubEvent = req.header('x-github-event') ?? 'unknown';
    const payload = req.body;
    let message: string;

    switch (githubEvent) {
      case 'star':
        message = this.githubService.onStar(payload);
        break;
      case 'issue':
        message = this.githubService.onIssue(payload);
        break;
      default:
        message = `Unknown event ${githubEvent}`;
    }

    this.discordService
      .notify(message)
      .then(() => res.status(200).send('Accepted'))
      .catch(() =>
        res.status(500).json({
          error: 'Internal server error',
        }),
      );
  };
}

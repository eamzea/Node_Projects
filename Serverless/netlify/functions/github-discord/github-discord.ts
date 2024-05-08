import { Handler, HandlerContext, HandlerEvent } from '@netlify/functions';
import * as crypto from 'crypto';

const notify = async (message: string) => {
  const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL ?? '';

  const body = {
    content: message,
  };

  const response = await fetch(discordWebhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    console.log('Error sending message');
    return false;
  }

  return true;
};

const verify_signature = (req: HandlerEvent) => {
  const GITHUB_SECRET = process.env.GITHUB_SECRET ?? '';

  console.log({ GITHUB_SECRET });

  try {
    const signature = crypto
      .createHmac('sha256', GITHUB_SECRET)
      .update(JSON.stringify(req.body))
      .digest('hex');
    const xHubSignature = req.headers['x-hub-signature-256'] ?? '';

    console.log({ xHubSignature, signature });

    let trusted = Buffer.from(`sha256=${signature}`, 'ascii');
    let untrusted = Buffer.from(xHubSignature, 'ascii');

    console.log({ trusted, untrusted });
    console.log({ verify_result: crypto.timingSafeEqual(trusted, untrusted) });

    return {
      ok: crypto.timingSafeEqual(trusted, untrusted),
    };
  } catch (error) {
    console.log({ error });

    return {
      ok: false,
      error,
    };
  }
};

const onStar = (payload: any): string => {
  const { action, sender, repository } = payload;

  return `User ${sender.login} ${action} star on ${repository.full_name}`;
};

const onIssue = (payload: any): string => {
  const { action, issue } = payload;

  if (action === 'opened') {
    return `An issue was opened with this title ${issue.title}`;
  }

  if (action === 'closed') {
    return `An issue was closed by ${issue.user.login}`;
  }

  return `Unhandled action for the issue event ${action}`;
};

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  try {
    const githubEvent = event.headers['x-github-event'] ?? 'unknown';
    const payload = JSON.parse(event.body ?? '{}');
    const isGithubReq = verify_signature(event);

    if (!isGithubReq.ok) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Unauthorized', error: isGithubReq.error }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    }

    let message: string;

    switch (githubEvent) {
      case 'star':
        message = onStar(payload);
        break;
      case 'issue':
        message = onIssue(payload);
        break;
      default:
        message = `Unknown event ${githubEvent}`;
    }

    await notify(message);

    return {
      statusCode: 200,
      body: JSON.stringify({ message }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    console.log(error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error', error }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
};

export { handler };

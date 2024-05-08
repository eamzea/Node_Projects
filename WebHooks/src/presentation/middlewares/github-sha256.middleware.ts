import { NextFunction, Request, Response } from 'express';
import * as crypto from 'crypto';
import { envs } from '../../config';

const GITHUB_SECRET: string = envs.GITHUB_SECRET;

const verify_signature = (req: Request) => {
  try {
    const signature = crypto
      .createHmac('sha256', GITHUB_SECRET)
      .update(JSON.stringify(req.body))
      .digest('hex');
    const xHubSignature = req.header('x-hub-signature-256') ?? '';
    let trusted = Buffer.from(`sha256=${signature}`, 'ascii');
    let untrusted = Buffer.from(xHubSignature, 'ascii');

    return crypto.timingSafeEqual(trusted, untrusted);
  } catch (error) {
    console.log(error);
    return false;
  }
};

export class GitHubSha256Middleware {
  static verifySignature = (req: Request, res: Response, next: NextFunction) => {
    if (!verify_signature(req)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    next();
  };
}

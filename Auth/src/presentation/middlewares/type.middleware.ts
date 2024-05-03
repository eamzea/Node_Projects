import { NextFunction, Request, Response } from 'express';

export class TypeMiddleware {
  static validTypes(validTypes: string[], position: number = 2) {
    return (req: Request, res: Response, next: NextFunction) => {
      const type = req.url.split('/').at(position) ?? '';

      if (!validTypes.includes(type)) {
        return res.status(400).json({
          error: `Invalid type: ${type}. Just these ones ${validTypes}`,
        });
      }

      next()
    }
  }
}

import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { CustomError } from '../../domain/errors';

export class ImagesController {
  getImage = (req: Request, res: Response) => {
    const { type = '', image = '' } = req.params
    const imgPath = path.resolve(__dirname, `../../../uploads/${type}/${image}`)

    if (!fs.existsSync(imgPath)) {
      throw CustomError.badRequest(`File does not exists`)
    }

    console.log(imgPath)

    res.sendFile(imgPath)
  };

}

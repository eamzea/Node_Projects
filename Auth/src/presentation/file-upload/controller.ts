import { Request, Response } from 'express';
import { CustomError } from '../../domain/errors';
import { FileUploadService } from '../services/file-upload.service';

export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  };

  uploadFile = async (req: Request, res: Response) => {
    const type = req.params.type;
    const file = req.body.files.at(0);

    this.fileUploadService
      .uploadSingle(file, `uploads/${type}`)
      .then(uploaded =>
        res.json({
          message: 'File uploaded successfully',
          uploaded,
        }),
      )
      .catch(error => this.handleError(error, res));
  };

  uploadMultipleFiles = async (req: Request, res: Response) => {
    const type = req.params.type;
    const files = req.body.files;

    this.fileUploadService
      .uploadMultiple(files, `uploads/${type}`)
      .then(uploaded => {
        if (uploaded.some(result => Object.keys(result).includes('statusCode'))) {
          return res.status(207).json({
            message: 'Some files were uploaded successfully',
            uploaded,
          });
        }

        return res.json({
          message: 'Files uploaded successfully',
          uploaded,
        });
      })
      .catch(error => this.handleError(error, res));
  };
}

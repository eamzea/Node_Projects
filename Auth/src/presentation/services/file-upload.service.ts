import { UploadedFile } from 'express-fileupload';
import path from 'path';
import fs from 'fs';
import { UuidAdapter } from '../../config';
import { CustomError } from '../../domain/errors';

export class FileUploadService {
  constructor(private readonly uuid = UuidAdapter.v4) {}

  private checkFolder(folderPath: string) {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
  }

  async uploadSingle(
    file: UploadedFile,
    folder: string = 'uploads',
    validExtensions: string[] = ['png', 'jpg', 'jpeg', 'gif'],
  ) {
    try {
      const fileExtension = file.mimetype.split('/').at(1) ?? '';

      if (!validExtensions.includes(fileExtension)) {
        throw CustomError.badRequest(
          `Extension ${fileExtension} for file: ${file.name} is not valid, only these: ${validExtensions}`,
        );
      }

      const destination = path.resolve(__dirname, '../../../', folder);
      this.checkFolder(destination);

      const fileName = `${this.uuid()}.${fileExtension}`;

      file.mv(`${destination}/${fileName}`);

      return { fileName: `File: ${file.name} was uploaded with this name: ${fileName}` };
    } catch (error) {
      throw error instanceof CustomError ? error : CustomError.internalServer(`${error}`);
    }
  }

  async uploadMultiple(
    files: UploadedFile[],
    folder: string = 'uploads',
    validExtensions: string[] = ['png', 'jpg', 'jpeg', 'gif'],
  ) {
    const fileNames = await Promise.allSettled(
      files.map(file => this.uploadSingle(file, folder, validExtensions)),
    );

    const fileNamesResolved = fileNames.map(fileName => ({
      ...(fileName.status === 'fulfilled' && { ...fileName.value }),
      ...(fileName.status === 'rejected' && { error: fileName.reason.message }),
    }));

    return fileNamesResolved;
  }
}

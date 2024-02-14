import fs from 'fs';
export interface SaveFileIF {
  execute: (options: SaveFileOptions) => boolean
}

export interface SaveFileOptions {
  fileContent: string;
  destination?: string;
  fileName?: string
}

export class SaveFile implements SaveFileIF {
  constructor() { }

  execute({ fileContent, destination = 'outputs', fileName = 'table' }: SaveFileOptions) {
    fs.mkdirSync(destination, { recursive: true })
    fs.writeFileSync(`${destination}/${fileName}.txt`, fileContent)
    return true
  }
}

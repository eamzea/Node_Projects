import { SaveFile, SaveFileOptions } from './save-file';
import fs from 'fs';
describe('Save File', () => {
  const defaultOptions: SaveFileOptions = {
      fileContent: 'file Content'
    }

  afterEach(() => {
    const outputsExists = fs.existsSync('outputs');
    if (outputsExists) {
      fs.rmSync('outputs', { recursive: true })
    }

    delete defaultOptions.destination;
    delete defaultOptions.fileName;
  })

  it('should save a file with default values', () => {
    const file = new SaveFile();

    const result = file.execute(defaultOptions);
    const filePath = 'outputs/table.txt'
    const checkFile = fs.existsSync(filePath)
    const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });

    expect(result).toBeTruthy();
    expect(checkFile).toBe(true);
    expect(fileContent).toEqual(defaultOptions.fileContent);
  })

  it('should save a file with custom values', () => {
    const file = new SaveFile();
    defaultOptions.destination = 'outputs/table/';
      defaultOptions.fileName = 'customTable';

    const result = file.execute(defaultOptions);
    const filePath = `${defaultOptions.destination}${defaultOptions.fileName}.txt`;
    expect(result).toBeTruthy();
    expect(fs.existsSync(filePath)).toBe(true);
  })

  it('should return false', () => {
    const file = new SaveFile();
    const mkdirSpy = jest.spyOn(fs, "mkdirSync").mockImplementationOnce(() => { throw new Error() });
    const result = file.execute(defaultOptions)

    expect(result).toBe(false);

    mkdirSpy.mockRestore()
  })
})

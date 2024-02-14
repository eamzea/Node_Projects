import { CreateTable } from '../domain/use-cases/create-table';
import { SaveFile } from '../domain/use-cases/save-file';
import { ServerApp } from './server-app';

describe('Server App', () => {
  const defaultOptions = {
    base: 1, limit: 10, showTable: true, destination: 'testDestination', name: 'testName'
  }
  it('should create instance', () => {
    const app = new ServerApp();

    expect(app).toBeInstanceOf(ServerApp);
    expect(typeof ServerApp.run).toBe('function');
  })

  it('should run with custom mocks and showing table', () => {
    const logMock = jest.fn()
    const logErrorMock = jest.fn()
    const createTableMock = jest.fn().mockReturnValue('1 x 1 = 1')
    const saveFileMock = jest.fn().mockReturnValue(true)

    global.console.log = logMock;
    global.console.error = logErrorMock;
    CreateTable.prototype.execute = createTableMock;
    SaveFile.prototype.execute = saveFileMock

    ServerApp.run(defaultOptions)

    expect(createTableMock).toHaveBeenCalledWith({base: defaultOptions.base, limit: defaultOptions.limit})
    expect(saveFileMock).toHaveBeenCalledWith({
      destination: defaultOptions.destination,
      fileContent: '1 x 1 = 1',
      fileName: defaultOptions.name
    })
    expect(logMock).toHaveBeenCalledWith('1 x 1 = 1')
    expect(logMock).toHaveBeenCalledWith('File created')
    expect(logErrorMock).not.toHaveBeenCalled()
  })

  it('should run with custom mocks and not saving file', () => {
    const logMock = jest.fn()
    const logErrorMock = jest.fn()
    const createTableMock = jest.fn().mockReturnValue('1 x 1 = 1')
    const saveFileMock = jest.fn().mockReturnValue(false)

    global.console.log = logMock;
    global.console.error = logErrorMock;
    CreateTable.prototype.execute = createTableMock;
    SaveFile.prototype.execute = saveFileMock

    ServerApp.run(defaultOptions)

    expect(createTableMock).toHaveBeenCalledWith({base: defaultOptions.base, limit: defaultOptions.limit})
    expect(saveFileMock).toHaveBeenCalledWith({
      destination: defaultOptions.destination,
      fileContent: expect.any(String),
      fileName: defaultOptions.name
    })
    expect(logErrorMock).toHaveBeenCalledWith('File not created')
  })
})

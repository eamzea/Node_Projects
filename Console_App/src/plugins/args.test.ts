const originalArgs = process.argv;

const runCommand = async (args: string[]) => {
  process.argv = [...process.argv, ...args]

  const { yarg } = await import('./args');

  return yarg

}

describe('ARGS', () => {
  beforeEach(() => {
    process.argv = originalArgs;
    jest.resetModules()
  })

  it('should return default values', async () => {
    const argv = await runCommand(['-b', '5'])

    expect(argv).toEqual(expect.objectContaining({
      b: 5,
      d: './outputs',
      l: 10,
      n: 'table',
      s: false,
    }))
  })

  it('should return with custom values', async () => {
    const argv = await runCommand(['-b', '10', '-d', './customDirectory', '-l', '5', '-n', 'customName', '-s', 'true'])

    expect(argv).toEqual(expect.objectContaining({
      b: 10,
      d: './customDirectory',
      l: 5,
      n: 'customName',
      s: true,
    }))
  })
})

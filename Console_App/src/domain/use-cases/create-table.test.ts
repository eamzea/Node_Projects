import { CreateTable } from './create-table';
describe('Create Table', () => {
  it('should create a table with default values', () => {
    const newTable = new CreateTable()
    const table = newTable.execute({ base: 2 })
    const rows = table.split('\n').length

    expect(newTable).toBeInstanceOf(CreateTable)
    expect(table).toContain('2 x 1 = 2');
    expect(table).toContain('2 x 10 = 20');
    expect(rows).toBe(10)
  })

  it('should create a table with custom basic values', () => {
    const newTable = new CreateTable()
    const table = newTable.execute({ base: 3, limit: 20 })
    const rows = table.split('\n').length

    expect(table).toContain('3 x 1 = 3');
    expect(table).toContain('3 x 20 = 60');
    expect(rows).toBe(20)
  })
})

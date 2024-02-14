import { CreateTable } from "../domain/use-cases/create-table";
import { SaveFile } from "../domain/use-cases/save-file";

interface RunOptions {
  base: number;
  limit: number;
  showTable: boolean;
  name?: string;
  destination?: string
}

export class ServerApp {
  static run({ base, limit, showTable, destination, name }: RunOptions) {
    const table = new CreateTable().execute({ base, limit })
    const result = new SaveFile().execute({fileContent: table, destination, fileName: name})

    if (showTable) {
      console.log(table)
    }
  }
}

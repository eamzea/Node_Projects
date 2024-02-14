export interface CreateTableIF {
  execute: (options: ExecuteOptionsIF) => string
}

export interface ExecuteOptionsIF {
  base: number;
  limit?: number
}

export class CreateTable implements CreateTableIF {
  constructor(
    // DI - Dependency Injection
  ) { }

  execute({ base, limit = 10 }: ExecuteOptionsIF) {
    let outputMessage = '';
    for (let i = 1; i <= limit; i++) {
      outputMessage += `${base} x ${i} = ${base * i}\n`
    }

    return outputMessage
  }
}

import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'

export const yarg = yargs(hideBin(process.argv)).options(
  {
      'b': {
      alias: 'base',
      demandOption: true,
      type: 'number',
      describe: 'Base Operation'
    },
      'd': {
      alias: 'destination',
        type: 'string',
      default: './outputs',
      describe: 'File Destination'
    },
    'l': {
      alias: 'limit',
      default: 10,
      type: 'number',
      describe: 'Limit Operation'
    },
    'n': {
      alias: 'name',
      default: 'table',
      type: 'string',
      describe: 'File Name'
    },
    's': {
      alias: 'show',
      type: 'boolean',
      default: false,
      describe: 'Show Table'
      }
  }
).parseSync()

import * as yargs from 'yargs';
import * as commands from './commands';

yargs
  .command(
    ['init', 'initialize', 'i'],
    'Create a new site',
    () => {
      return yargs
        .option('p', {
          alias: 'path',
          default: `${process.cwd()}`,
          describe: 'the directory to create the site in',
          type: 'string',
        });
    },
    (argv) => {
      commands.initialize(argv);
    },
  )
  .command(
    ['$0', 'build', 'b'],
    'Build the site',
    (argv) => {
      commands.build(argv);
    },
  )
  .usage('Usage: $0 <command> [options]')
  .help('h')
  .alias('h', 'help')
  .epilogue('Copyright 2019 Colin Burr')
  .parse();

import * as yargs from 'yargs';
import * as initialize from './commands/initialize';
import * as build from './commands/build';

yargs
  .command(initialize)
  .command(build)
  .usage('Usage: $0 <command> [options]')
  .help('h')
  .alias('h', 'help')
  .epilogue('Copyright 2019 Colin Burr')
  .parse();

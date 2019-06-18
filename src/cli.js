import * as yargs from 'yargs';
import * as commands from './commands';

const cli = () => {
  yargs
    .command(
      ['init', 'initialize', 'i'],
      'Create a new site in the current directory',
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
};

export default cli;

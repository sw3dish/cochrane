import initialize from './initialize';

export const command = ['init [path]', 'initialize', 'i'];

export const describe = 'Create a new site';

export const builder = (yargs) => {
  return yargs
    .positional('path', {
      alias: 'path',
      default: `${process.cwd()}`,
      describe: 'The directory to create the site in',
      type: 'string',
    });
};

export const handler = (argv) => {
  initialize(argv);
};

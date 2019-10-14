import build from './build';

export const command = ['$0', 'build', 'b'];

export const describe = 'Build the contents of content directory into site';

export const builder = (yargs) => {
  return yargs;
};

export const handler = (argv) => {
  build(argv);
};

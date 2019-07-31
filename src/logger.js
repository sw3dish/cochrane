import chalk from 'chalk';

const prefix = '{gray [graaff]}';

export function info(message) {
  // eslint-disable-next-line no-console
  console.log(chalk`${prefix} {blue ${message}}`);
}

export function warn(message) {
  // eslint-disable-next-line no-console
  console.log(chalk`${prefix} {yellow ${message}}`);
}

export function error(message) {
  // eslint-disable-next-line no-console
  console.log(chalk`${prefix} {red ${message}}`);
}

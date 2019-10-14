import * as fse from 'fs-extra';
import * as path from 'path';

import * as log from '../../logger';

export default async function initialize(argv) {
  try {
    await fse.copy(path.resolve(__dirname, '../../../boilerplate'), argv.path, {
      filter: src => !src.includes('.gitkeep'),
    });
    log.info('Graaff has generated the skeleton of a site for you.');
  } catch (error) {
    log.error(error);
  }
}

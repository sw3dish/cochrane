"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = initialize;

var fse = _interopRequireWildcard(require("fs-extra"));

var path = _interopRequireWildcard(require("path"));

var log = _interopRequireWildcard(require("../../logger"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

async function initialize(argv) {
  try {
    await fse.copy(path.resolve(__dirname, '../../../boilerplate'), argv.path, {
      filter: src => !src.includes('.gitkeep')
    });
    log.info('Graaff has generated the skeleton of a site for you.');
  } catch (error) {
    log.error(error);
  }
}
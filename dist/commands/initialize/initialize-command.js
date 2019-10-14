"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = exports.builder = exports.describe = exports.command = void 0;

var _initialize = _interopRequireDefault(require("./initialize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const command = ['init [path]', 'initialize', 'i'];
exports.command = command;
const describe = 'Create a new site';
exports.describe = describe;

const builder = yargs => {
  return yargs.positional('path', {
    alias: 'path',
    default: `${process.cwd()}`,
    describe: 'The directory to create the site in',
    type: 'string'
  });
};

exports.builder = builder;

const handler = argv => {
  (0, _initialize.default)(argv);
};

exports.handler = handler;
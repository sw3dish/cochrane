"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.info = info;
exports.warn = warn;
exports.error = error;

var _chalk = _interopRequireDefault(require("chalk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const prefix = '{gray [graaff]}';

function info(message) {
  // eslint-disable-next-line no-console
  console.log(_chalk.default`${prefix} {blue ${message}}`);
}

function warn(message) {
  // eslint-disable-next-line no-console
  console.log(_chalk.default`${prefix} {yellow ${message}}`);
}

function error(message) {
  // eslint-disable-next-line no-console
  console.log(_chalk.default`${prefix} {red ${message}}`);
}
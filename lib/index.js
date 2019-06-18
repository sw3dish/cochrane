#!/usr/bin/env node
"use strict";

var _yargs = _interopRequireDefault(require("yargs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_yargs["default"].usage('Usage: $0 <command> [options]').help('h').alias('h', 'help').argv;
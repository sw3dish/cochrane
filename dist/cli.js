"use strict";

var yargs = _interopRequireWildcard(require("yargs"));

var initialize = _interopRequireWildcard(require("./commands/initialize"));

var build = _interopRequireWildcard(require("./commands/build"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

yargs.command(initialize).command(build).usage('Usage: $0 <command> [options]').help('h').alias('h', 'help').epilogue('Copyright 2019 Colin Burr').parse();
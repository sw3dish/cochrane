"use strict";

var yargs = _interopRequireWildcard(require("yargs"));

var commands = _interopRequireWildcard(require("./commands"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

yargs.command(['init', 'initialize', 'i'], 'Create a new site in the current directory', function (argv) {
  commands.initialize(argv);
}).command(['$0', 'build', 'b'], 'Build the site', function (argv) {
  commands.build(argv);
}).usage('Usage: $0 <command> [options]').help('h').alias('h', 'help').epilogue('Copyright 2019 Colin Burr').parse();
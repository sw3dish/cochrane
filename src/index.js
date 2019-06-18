#!/usr/bin/env node
import argv from 'yargs';

argv
  .usage('Usage: $0 <command> [options]')
  .help('h')
  .alias('h', 'help')
  .argv;

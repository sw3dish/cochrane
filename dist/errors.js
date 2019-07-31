"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FrontMatterSyntaxError = exports.FrontMatterExistsError = void 0;

class FrontMatterExistsError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FrontMatterExistsError';
  }

}

exports.FrontMatterExistsError = FrontMatterExistsError;

class FrontMatterSyntaxError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FrontMatterSyntaxError';
  }

}

exports.FrontMatterSyntaxError = FrontMatterSyntaxError;
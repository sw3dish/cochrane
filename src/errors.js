export class FrontMatterExistsError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FrontMatterExistsError';
  }
}
export class FrontMatterSyntaxError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FrontMatterSyntaxError';
  }
}

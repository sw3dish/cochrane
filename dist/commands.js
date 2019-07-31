"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialize = initialize;
exports.build = build;

var fse = _interopRequireWildcard(require("fs-extra"));

var path = _interopRequireWildcard(require("path"));

var _marked = _interopRequireDefault(require("marked"));

var Mustache = _interopRequireWildcard(require("mustache"));

var _errors = require("./errors");

var log = _interopRequireWildcard(require("./logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

/**
 * Extract the front matter denoted by JSON surrounded by --- delimiters
 * from a page/post file
 * @param {String} fileString The contents of a file
 * @return {Object} The front matter of the page/post
 */
function extractFrontMatter(fileString) {
  const frontMatterRegex = /---\s([\s\S]*)\s---/;
  const requiredFrontMatter = ['layout', 'title'];
  let frontMatter = null;

  try {
    frontMatter = JSON.parse(frontMatterRegex.exec(fileString)[1]);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new _errors.FrontMatterExistsError();
    } else if (error instanceof SyntaxError) {
      throw new _errors.FrontMatterSyntaxError();
    }
  }

  requiredFrontMatter.forEach(key => {
    if (!(key in frontMatter)) {
      throw new _errors.FrontMatterSyntaxError();
    }
  });
  return frontMatter;
}
/**
 * Extract the Markdown contents from a page/post file
 * @param {String} fileString The contents of a file
 * @return {Object} The front matter of the page/post
 */


function extractContents(fileString) {
  const contentsRegex = /---\s[\s\S]*\s---([\s\S]*)/;
  return contentsRegex.exec(fileString)[1];
}
/**
 * Use mustache.js to create page
 * @param {String} layoutHtml the layout HTML to base the page on
 * @param {Object} view the context to create the page with
 * @return {String} the HTML to be written to the .html page file
 */


function createPageHtml(layoutHtml, view) {
  return Mustache.render(layoutHtml, view);
}
/**
 * Get the HTMl of the specified layout to base the page on
 * @param {String} layout the layout to get the HTML for
 * @return {String} the HTML to base the page on
 */


function getLayoutHtml(layout) {
  return fse.readFile(path.join(process.cwd(), 'layouts', `${layout}.mustache`), 'utf8');
}
/**
 * Build content in the file name that is passed in
 * @param {String} fileName the Markdown file to build HTML from
 */


async function buildPage(fileName, partials, contentDirectoryPath) {
  let fileString = '';

  try {
    fileString = await fse.readFile(path.join(contentDirectoryPath, fileName), 'utf8');
  } catch (error) {
    log.error(`${fileName} could not be opened.`);
    return;
  }

  let frontMatter = {};

  try {
    frontMatter = extractFrontMatter(fileString);
  } catch (error) {
    if (error instanceof _errors.FrontMatterExistsError) {
      log.error(`No front matter was provided for ${fileName}. ${fileName} will not be built.`);
    } else if (error instanceof _errors.FrontMatterSyntaxError) {
      log.error(`Invalid front matter was provided for ${fileName}. ${fileName} will not be built.`);
    }

    return;
  }

  const contentHtml = (0, _marked.default)(extractContents(fileString));
  const view = { ...frontMatter,
    content: contentHtml
  };
  const layoutHtml = await getLayoutHtml(frontMatter.layout);
  const pageHtml = createPageHtml(layoutHtml, view);
  let outputFileName = '';

  if ('slug' in frontMatter) {
    outputFileName = `${frontMatter.slug}.html`;
  } else {
    const fileNameParts = fileName.split('.');
    fileNameParts.pop();
    outputFileName = `${fileNameParts.join('-')}.html`;
  }

  const pagePath = path.join(process.cwd(), 'site', outputFileName);
  await fse.writeFile(pagePath, pageHtml);
  log.info(`${fileName} was created successfully at: ${pagePath}`);
}
/**
 * Build the content in the directory name that is passed in
 * @param {String} directoryName
 */


async function buildDirectory(directoryName, partials) {
  const contentDirectoryPath = path.join(process.cwd(), 'content', directoryName);

  try {
    const fileNames = await fse.readdir(contentDirectoryPath);
    fileNames.forEach(async fileName => {
      await buildPage(fileName, partials, contentDirectoryPath);
    });
  } catch (error) {
    log.error(error);
  }
}

async function loadPartial(partialName, partialsPath) {
  let partialString = '';

  try {
    partialString = await fse.readFile(path.join(partialsPath, partialName), 'utf8');
  } catch (error) {
    log.error(`${partialName} could not be opened.`);
  }

  return partialString;
}

async function loadPartials() {
  const partialsPath = path.join(process.cwd(), 'partials');
  const partials = {};

  try {
    const partialNames = await fse.readdir(partialsPath);
    partialNames.forEach(async partialName => {
      partials[partialName] = loadPartial(partialName, partialsPath);
    });
  } catch (error) {
    log.error(error);
  }

  return partials;
}

async function initialize() {
  try {
    await fse.copy(path.resolve(__dirname, '../boilerplate'), '.');
    log.info('Graaff has generated the skeleton of a site for you.');
  } catch (error) {
    log.error(error);
  }
}

async function build() {
  const contentDirectories = ['pages', 'posts'];
  const partials = await loadPartials();
  contentDirectories.forEach(async directoryName => {
    try {
      await buildDirectory(directoryName, partials);
    } catch (error) {
      log.error(`${directoryName} does not exist!`);
    }
  });
}
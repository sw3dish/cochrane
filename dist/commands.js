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

var _htmlMinifier = require("html-minifier");

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
  const frontMatterRegex = /---\s([\s\S]*?)\s---/;
  const requiredFrontMatter = ['layout', 'title']; // try to get the front matter from the beginning of the file string

  let frontMatter = null;

  try {
    frontMatter = JSON.parse(frontMatterRegex.exec(fileString)[1]);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new _errors.FrontMatterExistsError();
    } else if (error instanceof SyntaxError) {
      throw new _errors.FrontMatterSyntaxError();
    }
  } // make sure the front matter has the required keys


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
  // get everything after the front matter
  const contentsRegex = /---\s[\s\S]*?\s---([\s\S]*)/;
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

function buildOutputFileName(frontMatter, fileName) {
  // determine if we should use the slug for a file name or use the original file name
  let outputFileName = '';

  if ('slug' in frontMatter) {
    outputFileName = `${frontMatter.slug}.html`;
  } else {
    const fileNameParts = fileName.split('.');
    fileNameParts.pop();
    outputFileName = `${fileNameParts.join('-')}.html`;
  }

  return outputFileName;
}
/**
 * Build content in the file name that is passed in
 * @param {String} fileName the Markdown file to build HTML from
 * @param {Array} partials a collection of partials to use in creating the content
 * @param {String} contentDirectoryPath where content is loaded
 */


async function buildPage(fileName, partials, contentDirectoryPath) {
  // try to open the file
  let fileString = '';

  try {
    fileString = await fse.readFile(path.join(contentDirectoryPath, fileName), 'utf8');
  } catch (error) {
    log.error(`${fileName} could not be opened.`);
    return;
  } // try to get the front matter


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
  } // convert the contents of the file to Markdown


  const contentHtml = (0, _marked.default)(extractContents(fileString)); // populate our view object for mustache rendering

  const view = { ...frontMatter,
    content: contentHtml,
    partials
  }; // get the layout HTML for rendering

  const layoutHtml = await getLayoutHtml(frontMatter.layout); // create the HTML to be written to the file

  const pageHtml = createPageHtml(layoutHtml, view);
  const minifyOptions = {
    removeComments: true,
    removeEmptyAttributes: true,
    html5: true,
    collapseWhitespace: true,
    minifyCSS: true
  };
  const minifiedHtml = (0, _htmlMinifier.minify)(pageHtml, minifyOptions);
  const outputFileName = buildOutputFileName(frontMatter, fileName);
  const pagePath = path.join(process.cwd(), 'site', outputFileName); // write the HTML to the file

  await fse.writeFile(pagePath, minifiedHtml);
  log.info(`${fileName} was created successfully at: ${pagePath}`);
}
/**
 * Build the content in the directory name that is passed in
 * @param {String} directoryName the directory to build files from
 * @param {Array} partials a collection of partials to use in creating the content
 */


async function buildDirectory(directoryName, partials) {
  const contentDirectoryPath = path.join(process.cwd(), 'content', directoryName); // loop over all of the files in each content directory and create an HTML file for it

  try {
    const fileNames = await fse.readdir(contentDirectoryPath);
    fileNames.forEach(async fileName => {
      await buildPage(fileName, partials, contentDirectoryPath);
    });
  } catch (error) {
    log.error(error);
  }
}
/**
 * Load a single partial from a file
 * @param {String} partialName the name of the partial to load
 * @param {String} partialsPath the path of the partials directory
 */


async function loadPartial(partialName, partialsPath) {
  let partialString = '';

  try {
    partialString = await fse.readFile(path.join(partialsPath, partialName), 'utf8');
  } catch (error) {
    log.error(`${partialName} could not be opened.`);
  }

  return partialString;
}
/**
 * Load all partials for use in layout files
 * @return {Array} an Array of partials in string format
 */


async function loadPartials() {
  const partialsPath = path.join(process.cwd(), 'partials'); // loop over all the partial files and load them into an object where the value
  // is a string to use in mustache rendering

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
/**
 * The initialize command
 */


async function initialize(argv) {
  try {
    await fse.copy(path.resolve(__dirname, '../boilerplate'), argv.path, {
      filter: src => !src.includes('.gitkeep')
    });
    log.info('Graaff has generated the skeleton of a site for you.');
  } catch (error) {
    log.error(error);
  }
}
/**
 * The build command
 */


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
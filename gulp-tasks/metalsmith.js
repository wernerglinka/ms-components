const Metalsmith = require('metalsmith');
const assets = require('metalsmith-assets');
const drafts = require('@metalsmith/drafts');
const metadata = require('metalsmith-metadata');
const layouts = require('@metalsmith/layouts');
const inplace = require('metalsmith-in-place');
const permalinks = require('@metalsmith/permalinks');
const processLinks = require('metalsmith-links');
const prism = require('metalsmith-prism');
const CaptureTag = require('nunjucks-capture');
const showdown = require('showdown');
const converter = new showdown.Converter();

// functions to extend Nunjucks environment
const toUpper = string => string.toUpperCase();
const spaceToDash = string => string.replace(/\s+/g, '-');
const condenseTitle = string => string.toLowerCase().replace(/\s+/g, '');
const mdToHTML = string => converter.makeHtml(string);
const UTCdate = date => date.toUTCString();
const trimSlashes = string => string.replace(/(^\/)|(\/$)/g, "");

// get working directory
// workingDir is a child of "__dirname"
const path = require('path');
const workingDir = path.join(__dirname, '../');

// Define engine options for the inplace and layouts plugins
// these options are passed to the Nunjucks templating engine
const templateConfig = {
  engineOptions: {
    path: [`${workingDir}/layouts`, `${workingDir}/src/sources/assets/icons`],
    filters: {
      toUpper,
      spaceToDash,
      condenseTitle,
      mdToHTML,
      UTCdate,
      trimSlashes,
    },
    extensions: {
      CaptureTag: new CaptureTag(),
    },
  },
};

/**
 *  Function to implement the Metalsmith build process
 */
module.exports = function metalsmith(callback) {
  console.log('Building site with metalsmith ************************');

  Metalsmith(workingDir)
    .source('./src/content')
    .destination('./build')
    .clean(true)
    .metadata({
      buildDate: new Date(),
    })

    .use(metadata({
      site: "data/siteMetadata.json",
      nav: "data/siteNavigation.json"
    }))

    .use(drafts())

    .use(inplace(templateConfig))

    .use(permalinks())

    // layouts MUST come after permalinks so the template has access to the "path" variable
    .use(layouts(templateConfig))

    .use(prism({
      lineNumbers: true,
    }))

    .use(processLinks({
      hostNames: ["localhost", "ms-page-sections.netlify.app"]
    }))

    .use(
      assets({
        source: './src/assets/',
        destination: './assets/',
      })
    )

    .build(err => {
      if (err) {
        throw err;
      }
      callback();
    });
};

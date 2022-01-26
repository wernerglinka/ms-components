const Metalsmith = require('metalsmith');
const assets = require('metalsmith-assets');
const drafts = require('@metalsmith/drafts');
const metadata = require('metalsmith-metadata');
const layouts = require('@metalsmith/layouts');
const inplace = require('metalsmith-in-place');
const permalinks = require('@metalsmith/permalinks');
const writeMetadata = require('metalsmith-writemetadata');
const linkcheck = require('metalsmith-linkcheck');
const msif = require('metalsmith-if');
const CaptureTag = require('nunjucks-capture');

const util = require('gulp-util');

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

//const monitor = require('../local_modules/metalsmith-monitor');
const getExternalPages = require('../local_modules/wp-pages');
const getExternalPagesGraphQL = require('../local_modules/wp-graphql-pages');

// Define engine options for the inplace and layouts plugins
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

    // inject pages from wordpress
    /*
    .use(getExternalPages({
      sourceURL: "https://dev-metalsmith.pantheonsite.io/wp-json/wp/v2",
      contentTypes: ["pages", "things"]
    }))
    */

    // inject pages from wordpress
    // contentTypes arrays need plural and singular of CPTs as they may be different from just having a "s" appended
    .use(getExternalPagesGraphQL({
      sourceURL: "https://dev-metalsmith-with-graphql.pantheonsite.io/graphql",
      contentTypes: [["pages", "page"], ["things", "thing"]]
    }))

    .use(metadata({
      site: "data/siteMetadata.json",
      nav: "data/siteNavigation.json"
    }))

    .use(drafts())

    .use(inplace(templateConfig))

    .use(permalinks())

    // layouts MUST come after permalinks so the template has access to the "path" variable
    .use(layouts(templateConfig))

    .use(
      assets({
        source: './src/assets/',
        destination: './assets/',
      })
    )

    
    // Show all metadata for each page in console
    // Used for Debug only
    //.use(monitor())

    // Generate a metadata json file for each page
    // Used for Debug only
    .use(
      writeMetadata({
        pattern: ['**/*.html'],
        ignorekeys: ['next', 'contents', 'previous'],
        bufferencoding: 'utf8',
      })
    )

    .use(
      msif(!!util.env.linkcheck, () => {
        console.log('Checking internal links ******************************');
      })
    )
    .use(msif(!!util.env.linkcheck, linkcheck()))

    .build(err => {
      if (err) {
        throw err;
      }
      callback();
    });
};

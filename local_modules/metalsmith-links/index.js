'use strict'

const cheerio = require('cheerio');
const debug = require('debug')('metalsmith-links');
const extname = require('path').extname;
const url = require('url');

const isHTMLFile = (filePath) => {
  return /\.html|\.htm/.test(extname(filePath));
};

/**
 * Metalsmith plugin to process all site links.
 * 
 * Adds a target and rel attribute to all external links and 
 * strips the protocol and domain parts of any local link
 * 
 *
 * @param  {Object} options
 *   @property {array} hostNames
 */
 "use strict";


 module.exports = function processLinks(options) {
  options = options || {
    hostNames: [],
  };

  if (!options.hostNames.length) {
    console.log("Missing Host Name(s)");
    return;
  }

  const hostNames = options.hostNames;

  return (files, metalsmith, done) => {
    setImmediate(done);
    
    Object.keys(files).forEach(file => {

      if (!isHTMLFile(file)) {
        return;
      }

      const contents = files[file].contents.toString();
      const $ = cheerio.load(contents);

      $('a').each(function() {
        const thisLink = $(this);
        const linkAttributes = thisLink[0].attribs;
        const urlString = typeof linkAttributes.href === "string" ? url.parse(linkAttributes.href, true) : null;

        // check all links that have a protocol string, this implies that they also have a hostname
        if (urlString && urlString.protocol) {
          // check if this url is local
          if (hostNames.includes(urlString.hostname)) {
            // strip protocol//hostname from local link 
            thisLink.attr("href", urlString.pathname);
          } else {
            // add target='_blank' and rel='noopener noreferrer' to all external links
            thisLink.attr("target", "_blank");
            thisLink.attr("rel", "noopener noreferrer");
          } 
        }
      });

      files[file].contents = Buffer.from($.html()); 
    });
  }
};
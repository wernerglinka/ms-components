const { request, gql } = require('graphql-request');
const sectionQueries = require('./queries');
const buildQuery = require('./build-query')

/**
 * 
 * Metalsmith GraphQL plugin that uses a Wordpress Advanced Custom Fields flexible field 
 * layout object to define pages with sections.
 *
 * @param  {Object} options
 *   @property {String} sourceURL  // URL of the wordpress site
 *   
 */
 "use strict";

 module.exports = function getExternalPagesGraphQL(options) {
  options = options || {};

  if (!options.sourceURL) {
    console.log("Missing source URL");
    return;
  }

  if (!options.contentTypes.length) {
    console.log("Missing Content Type(s)");
    return;
  }

  const sourceURL = options.sourceURL;
  const contentTypes = options.contentTypes;

  
  // Build the query string
  queryString = buildQuery(contentTypes, sectionQueries);

  const query = gql`${queryString}`;

  return (files, metalsmith, done) => {

    // request all pages for all content types specified in options.contentTypes
    request(sourceURL, query)
    .then((data) => {

      // loop over content types
      // "key" will be the content type, for example "pages"
      Object.keys(data).forEach(key => {
          const contentTypePages = data[key].edges;

          // loop over all pages for the current content type
          contentTypePages.map(({node}) => {
            // get the page properties and the page sections for this page
            const { pageProperties, pageBuilder: {sections}, uri } = node;

            // uri (for example "/things/a-thing-page/") becomes the key for the file object
            // by first stripping the leading and trailing "/"s
            // then adding the file extension
            let fileName = `${uri.slice(1,-1)}.html`;

            // define the page
            const pageContent = {
              layout: pageProperties.layout,
              title: "Needs to be included in page properties",
              sections: sections,
              contents: Buffer.from('Not needed. If you see this, something is broken')
            };

            // add page to metalsmith object
            files[fileName] = pageContent;
          });
        
      })
      done();
    });
  
  }
};
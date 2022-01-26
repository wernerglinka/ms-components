const axios = require('axios').default;

/**
 * Metalsmith plugin that uses a Wordpress Advanced Custom Fields flexible field 
 * layout object to define pages with sections.
 *
 * @param  {Object} options
 *   @property {String} sourceURL  // URL of the wordpress site
 *   
 */
 "use strict";


 module.exports = function getExternalPages(options) {
  options = options || {};

  if (!options.sourceURL) {
    console.log("Missing source URL");
    return;
  }

  if (!options.contentTypes.length) {
    console.log("Missing Content Type(s)");
    return;
  }

  return (files, metalsmith, done) => {
    // we will be requesting pages of different content types, one request for every content type

    // create an array of URLs to get the various content type pages
    // source: https://www.storyblok.com/tp/how-to-send-multiple-requests-using-axios
    const requestURLs = options.contentTypes.map(contentType => `${options.sourceURL}/${contentType}/`);
    // create array of request promises
    const allRequests = requestURLs.map(url => axios.get(url));

    // execute request for every content type
    axios.all(allRequests).then(axios.spread((...responses) => {
      
      // loop over all content types
      responses.forEach(response => {
        
        // build the pages for this content type
        response.data.forEach(page => {
          
          // use content type and WP slug as file name/object key
          const contentType = page.type === 'page' ? "" : `${page.type}/`;
          const fileName = `${contentType}${page.slug}.html`;

          // define the page
          const pageContent = {
            layout: page.acf.layout,
            title: fileName.replace(/-/g, ' '),
            sections: page.acf.sections,
            contents: Buffer.from('this is a wordpress page')
          };

          // add page to metalsmith object
          files[fileName] = pageContent;
        });
      })

      done();
    }));
  }
};
/* jslint es6 */
/* global module, metalsmith, monitor, console */

/**
 *  Function to display a page object
 *  Page objects have a key that ends with ".html"
 */
 module.exports = function monitor() {
  return function plugin(files, metalsmith, done) {
    Object.keys(files).forEach(file => {
  
      // we only look at pages
      if (file.indexOf('.html') !== -1) {
        console.log(files[file]);
      }
    });
    done();
  };
};

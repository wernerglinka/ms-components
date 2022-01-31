const gulp = require('gulp');

module.exports = function processAnimations() {
  console.log('Moving Animations ************************************');
  return gulp
    .src('./src/sources/assets/animations/**.json')
    .pipe(gulp.dest(`./src/assets/animations`));
};

const gulp = require('gulp');
const rename = require("gulp-rename");
require('dotenv');

module.exports = function () {
	const theme = process.env.PRISM_THEME;
	console.log(`Loading Prism Style ${theme} **************************`);
  return gulp.src(`node_modules/prismjs/themes/prism-${theme}.css`)
		.pipe(rename("prism-styles.css"))
		.pipe(gulp.dest('src/assets/styles'));
};

 

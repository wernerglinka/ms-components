const gulp = require('gulp');
const rename = require("gulp-rename");
require('dotenv');

module.exports = function () {
	const theme = process.env.PRISM_THEME === "default" ? "prism" : `prism-${process.env.PRISM_THEME}`
	console.log(`Loading Prism Theme ${theme} *****************************`);
  return gulp.src(`node_modules/prismjs/themes/${theme}.css`)
		.pipe(rename("prism-styles.css"))
		.pipe(gulp.dest('src/assets/styles'));
};

 

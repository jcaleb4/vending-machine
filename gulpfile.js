var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    watch = require('gulp-watch');

/* PATHS */
var paths = {
  css: './public/css/**/*.styl',
  base: './public/css/_style.styl',
  dest: './public/css'
};

/* STYLES TASK*/
gulp.task('styles', function() {
  gulp.src(paths.base)
    .pipe(stylus())
    .pipe(gulp.dest(paths.dest));
});

/* DEFAULT / WATCH TASK */
gulp.task('default', ['styles'], function(){
	gulp.watch(paths.css, ['styles']);
});

// gulp
const gulp = require('gulp');

// server, unless using express
// const devBuild = (process.env.NODE_ENV !== 'production');
const browserSync = require('browser-sync').create();

// UTILITIES
// passes through only src files which are newer than the dest files
const newer = require('gulp-newer');
// combines files into one
const concat = require('gulp-concat');
// notifications for gulp activities
const notify = require('gulp-notify');
// delete files and folders using globs
const del = require('del');
// allows for a callback when piping more than two streams together
const pump = require('pump');

// JS
// minifies js files
// const uglify = require('gulp-uglify'); does not support ES6
const babili = require('gulp-babili');

// LESS
// compiles less files
const less = require('gulp-less');
const minifycss = require('gulp-minify-css');

const folders = {
  src: './src/',
  build: './public/'
};

// gulp defaults
gulp.task('default', ['clean', 'serve'], function() {
  gulp.start('less', 'html', 'js')
});

// browser sync server and watch/live changes
gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: `${folders.build}`
    },
    port: 8088,
    open: false
  });

  gulp.watch(`${folders.src}/less/**/*.less`, ['less']);
  gulp.watch(`${folders.src}/**/*.html`, ['html']);
  gulp.watch(`${folders.src}/js/**/*.js`, ['js']);
  gulp.watch(`${folders.build}/**`).on('change', browserSync.reload);
});


// compile less
gulp.task('less', function() {
  return gulp.src(`${folders.src}/less/main.less`)
  .pipe(less())
  .pipe(minifycss())
  .pipe(gulp.dest(`${folders.build}/css`))
  .pipe(browserSync.stream())
  .pipe(notify({ message: 'LESS compiled successfully' }));
});

// migrate html
gulp.task('html', function() {
  return gulp.src(`${folders.src}/**/*.html`)
    .pipe(newer(`${folders.build}`))
    .pipe(gulp.dest(`${folders.build}/`))
    .pipe(browserSync.stream())
    .pipe(notify({ message: 'HTML moved to dev_build successfully' }));
});

// bundle js files and minimize
gulp.task('js', function(cb) {
  pump([
    gulp.src(`${folders.src}/js/**/*.js`),
    concat('app.js'),
    // babili({
    //   mangle: {
    //     keepClassName: true
    //   }
    // }),
    gulp.dest(`${folders.build}/js`),
    browserSync.stream(),
    notify({ message: 'JS compiled successfully' })
    ],
    cb
  );
});


// flush dist folders
gulp.task('clean', function() {
  return del(`${folders.build}/**/*`);
});
const gulp = require('gulp'),
      sass = require('gulp-sass'),
      babelify = require('babelify'),
      minify = require('gulp-clean-css'),
      autoprefixer = require('gulp-autoprefixer'),
      sourcemaps = require('gulp-sourcemaps'),
      concat = require('gulp-concat'),
      uglify = require('gulp-uglify'),
      browserify = require('browserify'),
      watchify = require('watchify'),
      assign = require('lodash.assign'),
      gutil = require('gulp-util')
      source = require('vinyl-source-stream'),
      buffer = require('vinyl-buffer'),
      del = require('del');


/*
  Settings
*/

const customOpts = {
  entries: ['./src/assets/scripts/main.js'],
  debug: true
};
const opts = assign({}, watchify.args, customOpts);
let b = watchify(browserify(opts));
gulp.task('scripts', bundle);
b.on('update', bundle);
b.on('log', gutil.log);
b.transform(babelify, babelify.configure({
  presets: ["es2015"],
  comments: false
}));

let bProd = browserify(opts);
bProd.transform(babelify, babelify.configure({
  presets: ["es2015"],
  comments: false
}));
/*
  Compile stuff
*/
gulp.task('styles', () => {
  return gulp.src('./src/assets/styles/**/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(sourcemaps.init())
      .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
      }))
      .pipe(minify({compatibility: 'ie11'}))
      // .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./dist/assets/styles'));
});

function bundle () {
  return b.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/assets/scripts'));
}


function bundleProd () {
  return bProd.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./dist/assets/scripts'));
}

/*
  Copy files
*/

gulp.task('copyFonts', () => {
  return gulp.src('./src/assets/fonts/*.*')
    .pipe(gulp.dest('./dist/assets/fonts'));
});

gulp.task('copyImages', () => {
  return gulp.src('./src/assets/images/*.*')
    .pipe(gulp.dest('./dist/assets/images'));
});

gulp.task('copyHtml', () => {
  return gulp.src('./src/*.*')
    .pipe(gulp.dest('./dist'));
});

gulp.task('clean', () => {
  return del(['dist/**', '!dist']);
});

/*
  Watch task
*/

gulp.task('default', gulp.series(
  'clean',
  'styles',
  'scripts',
  gulp.parallel(
    'copyHtml',
    'copyImages',
    'copyFonts'
  )) ,() => {
  gulp.watch('./src/assets/styles/**/*.scss',['styles']);
  gulp.watch('./src/assets/scripts/**/*.js',['scripts']);
  gulp.watch('./src/assets/fonts/*.*',['copyFonts']);
  gulp.watch('./src/assets/images/**/*.*',['copyImages']);
  gulp.watch('./src/*.*',['copyHtml']);
});

/*
   Build
*/

gulp.task('scriptsProd', bundleProd);

gulp.task('build', gulp.series(
  'clean',
  'styles',
  'scriptsProd',
  gulp.parallel(
    'copyHtml',
    'copyImages',
    'copyFonts'
  )
));

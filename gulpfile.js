var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    minify = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    livereload = require('gulp-livereload');

gulp.task('sass', function () {
  gulp.src('src/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.init())
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(minify({compatibility: 'ie8'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('assets/css'))
    .pipe(livereload());
});

gulp.task('js', function(){
  gulp.src('src/js/*.js')
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('assets/js'))
    .pipe(livereload());
});

gulp.task('vendors-js', function(){
  gulp.src('src/js/vendors/*.js')
    .pipe(concat('vendors.js'))
    .pipe(uglify({
       preserveComments:'some'
     }))
    .pipe(gulp.dest('assets/js/vendors'))
    .pipe(livereload());
});

gulp.task('imgs', function () {
  gulp.src('src/images/*.*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('assets/images'));
});

gulp.task('default', function() {
  livereload.listen();
  gulp.start('sass', 'vendors-js', 'js', 'imgs');
  gulp.watch('src/sass/**/*.scss', ['sass']);
  gulp.watch('src/js/*.js', ['js']);
  gulp.watch('src/images/*.*', ['imgs']);
});
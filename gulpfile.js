var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');


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
    .pipe(gulp.dest('assets/css'));
});

gulp.task('js', function(){
  gulp.src('src/js/*.js')
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('assets/js'));
});

gulp.task('vendors-js', function(){
  gulp.src('src/js/vendors/*.js')
    .pipe(concat('vendors.js'))
    .pipe(uglify({
       preserveComments:'some'
     }))
    .pipe(gulp.dest('assets/js/vendors'));
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
  gulp.start('sass', 'vendors-js', 'js', 'imgs');
  gulp.watch('src/sass/**/*.scss', ['sass']);
  gulp.watch('src/js/*.js', ['js']);
  gulp.watch('src/images/*.*', ['imgs']);
});
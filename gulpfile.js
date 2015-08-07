var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');

gulp.task('sass', function () {
  gulp.src('src/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.init())
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('assets/css'));
});

gulp.task('js', function(){
  gulp.src('src/js/*.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest('assets/js'));
});

gulp.task('default', function() {
  gulp.watch('src/sass/*.scss', ['sass']);
  gulp.watch('src/js/*.js', ['js']);
});
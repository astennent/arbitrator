var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var flatten = require('gulp-flatten');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var connect = require('gulp-connect')

// Development Tasks 
// -----------------

gulp.task('javascript', function() {
  return gulp.src('src/js/**/*.js')
    .pipe(sourcemaps.init())
      .pipe(concat('arbitration.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'));
});

gulp.task('sass', function() {
  return gulp.src('src/scss/**/*.scss') // Gets all files ending with .scss in src/scss and children dirs
    .pipe(sass()) // Passes it through a gulp-sass
    .pipe(gulp.dest('dist')) // Outputs it in the css folder
});

gulp.task('watch', function() {
  gulp.watch('src/scss/**/*.scss', ['sass']);
  gulp.watch('src/js/**/*.js', ['javascript']);
});

gulp.task('build', ['sass', 'javascript']);

gulp.task('default', ['serveprod']);

gulp.task('serveprod', ['build', 'watch'], function() {
   connect.server({
      root: ["."],
      port: process.env.PORT || 5000, // localhost:5000
      livereload: false
   });
});


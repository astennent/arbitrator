var gulp = require('gulp');
var sass = require('gulp-sass')(require('node-sass'));
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var templateCache = require('gulp-angular-templatecache');
 
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
  gulp.watch('src/partials/**/*', ['templates']);
});

gulp.task('templates', function () {
   return gulp.src('src/partials/**/*.html')
      // .pipe(templateCache({ module: 'Arbitrator' }))
      .pipe(gulp.dest('dist'));
});

gulp.task('build', gulp.series('sass', 'javascript', 'templates'));

gulp.task('serveprod', gulp.series('build', 'watch'), function() {
   connect.server({
      root: ["."],
      port: process.env.PORT || 5000, // localhost:5000
      livereload: false
   });
});

gulp.task('default', gulp.series('serveprod'));
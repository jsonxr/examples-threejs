var gulp = require('gulp');
var bower = require('gulp-bower');
var nodemon = require('gulp-nodemon');


//----------------------------------------------------------------------------
// Bower
//----------------------------------------------------------------------------

gulp.task('bower-install', function taskBowerInstall() {
  return bower();
});

gulp.task('bower-copy', ['bower-install'], function taskBowerCopy() {
  return gulp.src([
      'bower_components/threejs/build/three.min.js'
    ])
    .pipe(gulp.dest('public/vendor/js'));
});

gulp.task('bower', ['bower-copy']);


//----------------------------------------------------------------------------
// nodemon
//----------------------------------------------------------------------------

gulp.task('default', function taskNodeMon() {
  var options = {
    watch: ['server.js'],
    script: 'server.js',
    ignore: ['./gulpfile.js', './browser/**']
  };
  return nodemon(options)
    .on('restart', function () {
      console.log('...restarting');
    });
});


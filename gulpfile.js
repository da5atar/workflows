// Using Node.js require command to import the Gulp plug-in into this file

var gulp = require('gulp'),
    gutil = require('gulp-util');

// Using this gulp var to issue different command

gulp.task('log', function() {
    gutil.log('Workflows are awesome');
});
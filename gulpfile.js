// Using Node.js require command to import the Gulp plug-in into this file
// all the methods and properties, from our gulp plug-in are going to be assigned to this variable.
var gulp = require('gulp'),
    gutil = require('gulp-util'), //use a variable called gutil, and then require the gulp-util plug-in
    coffee = require('gulp-coffee'); //doing the same for gulp-coffee

// Using this gulp var to issue different command
// Here, using the task method to create a task called log (name of what you're trying to do)

/* Commenting out the previous log task
gulp.task('log', function() {
    gutil.log('Workflows are awesome');
});
*/
gulp.task('coffee', function() {
    gulp.src('components/coffee/tagline.coffee')
     .pipe(coffee({bare: true})
        .on('error', gutil.log))
     .pipe(gulp.dest('components/scripts'))
});
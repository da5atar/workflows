// Using Node.js require command to import the Gulp plug-in into this file
// all the methods and properties, from our gulp plug-in are going to be assigned to this variable.
var gulp = require('gulp'),
    gutil = require('gulp-util'), //use a variable called gutil, and then require the gulp-util plug-in
    coffee = require('gulp-coffee'), //doing the same for gulp-coffee
    concat = require('gulp-concat'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass');

// Using these gulp var to issue different commands:

// Here, using the task method to create a task called log (name of what you're trying to do)

/* Commenting out the previous log task
gulp.task('log', function() {
    gutil.log('Workflows are awesome');
});
*/
//Array with paths to coffee script files
var coffeeSources = ['components/coffee/tagline.coffee']

// Array with the path of all different js docs
var jsSources = [
    'components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js'
];

// Variable for our Sass sources
var sassSources=['components/sass/style.scss'];

gulp.task('coffee', function() {
    gulp.src(coffeeSources)
     .pipe(coffee({bare: true})
        .on('error', gutil.log))
     .pipe(gulp.dest('components/scripts'))
});

gulp.task('js', function() {
    gulp.src(jsSources)
     .pipe(concat('script.js'))
     .pipe(browserify())
     .pipe(gulp.dest('builds/development/js'))
});

gulp.task('compass', function() {
    gulp.src(sassSources)
     .pipe(compass({
        sass: 'components/sass',
        image: 'builds/development/images',
        style: 'expanded'
     }))
     .on('error', gutil.log)
     .pipe(gulp.dest('builds/development/css'))
});

gulp.task('watch', function() {
    gulp.watch(coffeeSources, ['coffee']);
    gulp.watch(jsSources, ['js']);
    gulp.watch('components/sass/*.scss', ['compass']); //That way, if we make any changes in style.scss and any of the partials (.scss files with the underscores). watch is going to notice them, and reprocess them through compass.
});

gulp.task('default', ['coffee', 'js', 'compass']);
// Using Node.js require command to import the Gulp plug-in into this file
// all the methods and properties, from our gulp plug-in are going to be assigned to this variable.
var gulp = require('gulp'),
    gutil = require('gulp-util'), //use a variable called gutil, and then require the gulp-util plug-in
    coffee = require('gulp-coffee'), //doing the same for gulp-coffee
    concat = require('gulp-concat'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect');

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
var sassSources = ['components/sass/style.scss'];
var htmlSources = ['builds/development/*.html'];
var jsonSources = ['builds/development/js/*.json'];

//Creating Tasks

gulp.task('coffee', function() {
    gulp.src(coffeeSources)
     .pipe(coffee({bare: true})
        .on('error', gutil.log))
     .pipe(gulp.dest('components/scripts')) // the coffee's task job is to just to process coffee script, and then send a copy of the script that it generate into the JavaScript sources.
});

gulp.task('js', function() {
    gulp.src(jsSources)
     .pipe(concat('script.js'))
     .pipe(browserify())
     .pipe(gulp.dest('builds/development/js'))
     .pipe(connect.reload()) // reloads browser whenever anything in JavaScript changes.
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
     .pipe(connect.reload()) // That way when we make changes to any of the Compass files it will automatically reload them.
});

gulp.task('watch', function() {
    gulp.watch(coffeeSources, ['coffee']);
    gulp.watch(jsSources, ['js']); // Here, using variable jsSources to track .js files
    gulp.watch('components/sass/*.scss', ['compass']); //That way, if we make any changes in style.scss and any of the partials (.scss files with the underscores). watch is going to notice them, and reprocess them through compass.
    gulp.watch(htmlSources, ['html']);
    gulp.watch(jsonSources, ['json']);

});

gulp.task('connect', function(){
    connect.server({
        root:'builds/development/', //the root of our website. the parameter root takes essentially the location of our application.
        livereload: true // To auto reload the browser after changes
    });
});

gulp.task ('html', function(){
    gulp.src(htmlSources)
    .pipe(connect.reload())
});

gulp.task ('json', function(){
    gulp.src(jsonSources)
    .pipe(connect.reload())
});

gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'connect', 'watch']);
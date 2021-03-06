// Using Node.js require command to import the Gulp plug-in into this file
// all the methods and properties, from our gulp plug-in are going to be assigned to this variable.
var gulp = require('gulp'),
    gutil = require('gulp-util'), //use a variable called gutil, and then require the gulp-util plug-in
    coffee = require('gulp-coffee'), //doing the same for gulp-coffee
    concat = require('gulp-concat'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyHTML = require('gulp-minify-html'),
    jsonminify = require('gulp-jsonminify');

// var area i.e separating declaration from assignment
var env,
    coffeeSources,
    jsSources,
    sassSources,
    htmlSources,
    jsonSources,
    outputDir,
    sassStyle;

 env = process.env.NODE_ENV || 'development';

/*use process.env from node.js to check if we've setup
a NODE_ENV environment variable and assign it to env var
if not we use the default value of development
That way, if we'd set this up in our operating system,
then this new variable, called env, would get the value
of whatever we set, otherwise, it'll just assume that
we're in the development environment.
*/

//modify how the output directory variable is used, depending (conditionally) on what we set up as the environment variable.

 if (env ==='development') {
    outputDir = 'builds/development/';
    sassStyle = 'expanded';
} else {
    outputDir = 'builds/production/';
    sassStyle ='compressed';
}

// Using these gulp var to issue different commands:

// Here, using the task method to create a task called log (name of what you're trying to do)

/* Commenting out the previous log task
gulp.task('log', function() {
    gutil.log('Workflows are awesome');
});
*/

//Array with paths to coffee script files
 coffeeSources = ['components/coffee/tagline.coffee'];

// Array with the path of all different js docs
 jsSources = [
    'components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js'
];

// Variable for our Sass sources
 sassSources = ['components/sass/style.scss'];
 htmlSources = [outputDir + '*.html'];
 jsonSources = [outputDir + 'js/*.json'];

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
     .pipe(gulpif(env === 'production', uglify()))
     .pipe(gulp.dest(outputDir + '/js'))
     .pipe(connect.reload()) // reloads browser whenever anything in JavaScript changes.
});

gulp.task('compass', function() {
    gulp.src(sassSources)
     .pipe(compass({
        sass: 'components/sass',
        image: outputDir + '/images',
        //config_file: 'config.rb',
        style: sassStyle
     }))
     .on('error', gutil.log)
     .pipe(gulp.dest(outputDir + '/css'))
     .pipe(connect.reload()) // That way when we make changes to any of the Compass files it will automatically reload them.
});

gulp.task('watch', function() {
    gulp.watch(coffeeSources, ['coffee']);
    gulp.watch(jsSources, ['js']); // Here, using variable jsSources to track .js files
    gulp.watch('components/sass/*.scss', ['compass']); //That way, if we make any changes in style.scss and any of the partials (.scss files with the underscores). watch is going to notice them, and reprocess them through compass.
    gulp.watch('builds/development/*html', ['html']);
    gulp.watch('builds/development/js/*.json', ['json']);

});

gulp.task('connect', function(){
    connect.server({
        root: outputDir, //the root of our website. the parameter root takes essentially the location of our application.
        livereload: true // To auto reload the browser after changes
    });
});

gulp.task ('html', function(){
    gulp.src('builds/development/*html')
    .pipe(gulpif(env === 'production', minifyHTML()))
    .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
    .pipe(connect.reload())
});

gulp.task ('json', function(){
    gulp.src('builds/development/js/*.json')
    .pipe(gulpif(env === 'production', jsonminify()))
    .pipe(gulpif(env === 'production', gulp.dest('builds/production/js/')))
    .pipe(connect.reload())
});

gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'connect', 'watch']);
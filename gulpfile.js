var gulp = require('gulp');

// Plugins
var sass        = require('gulp-sass');
    autop       = require('gulp-autoprefixer');
    minify      = require('gulp-clean-css');
    uglify      = require('gulp-uglify');
    include     = require('gulp-include');
    rename      = require('gulp-rename');
    plumber     = require('gulp-plumber');
    notify      = require('gulp-notify');



var handleError = function(e)
{

    var message = 'An unknown error has occurred.';

    if (e.plugin == 'gulp-sass')
    {
        var file = e.relativePath;
        if (file && file.indexOf('/') > -1)
        {
            // Just grab filename
            file = file.substring(file.lastIndexOf('/') + 1);
        }

        message = file + ': ' + e.messageOriginal;
    }
    else if (e.plugin == 'gulp-uglify')
    {
        message = e.cause.filename + ':' + e.cause.line + ' - ' + e.message;
    }
    else if (e.hasOwnProperty('message'))
    {
        message = e.message;
    }


    notify.onError({
        title: e.plugin,
        subtitle: "Error",
        message: message,
        sound: 'Ping'
    })(e);

    this.emit('end');
};


// SCSS
gulp.task('scss', function()
{
    return gulp.src('resources/assets/scss/app.scss')
        .pipe(plumber({ errorHandler: handleError }))
        .pipe(sass())
        .pipe(autop({
            browsers: [ 'last 2 versions' ],
            cascade: false
        }))
        .pipe(minify())
        .pipe(rename('app.min.css'))
        .pipe(gulp.dest('public/'));
});


// Concat & Minify JS
gulp.task('js', function()
{
    return gulp.src('resources/assets/js/app.js')
        .pipe(plumber({ errorHandler: handleError }))
        .pipe(include())
        .pipe(uglify())
        .pipe(rename('app.min.js'))
        .pipe(gulp.dest('public/'));
});



// Watch
gulp.task('watch', function()
{
    gulp.watch('resources/assets/js/**/*.js', [ 'js' ]);
    gulp.watch('resources/assets/scss/**/*.scss', [ 'scss' ]);
});

gulp.task('default', [ 'scss', 'js', 'watch' ]);
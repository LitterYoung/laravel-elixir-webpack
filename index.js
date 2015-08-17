var gulp = require('gulp'),
    webpack = require('gulp-webpack'),
    gulpIf = require('gulp-if'),
    uglify = require('gulp-uglify'),
    gulpIgnore = require('gulp-ignore'),
    _ = require('underscore'),
    elixir = require('laravel-elixir'),
    utilities = require('laravel-elixir/ingredients/commands/Utilities'),
    notification = require('laravel-elixir/ingredients/commands/Notification');

elixir.extend('webpack', function (src, options) {
    var config = this;

    options = _.extend({
        debug:     ! config.production,
        srcDir:    config.assetsDir + 'js',
        outputDir: config.jsOutput,
    }, options);

    src = "./" + utilities.buildGulpSrc(src, options.srcDir);

    gulp.task('webpack', function () {
        var onError = function(e) {
            new notification().error(e, 'Webpack Compilation Failed!');
            this.emit('end');
        };

        return gulp.src(src)
            .pipe(webpack(options)).on('error', onError)
            .pipe(gulpIgnore.include('*.js'))
            .pipe(gulpIf(! options.debug, uglify()))
            .pipe(gulp.dest(options.outputDir))
            .pipe(new notification().message('Webpack Compiled!'));
    });

    this.registerWatcher('webpack', config.assetsDir + '/**/*.js');

    return this.queueTask('webpack');
});

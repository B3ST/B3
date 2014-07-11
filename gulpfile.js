'use strict';

var gulp          = require('gulp');
var $             = require('gulp-load-plugins')();
var runSequence   = require('run-sequence');
var browserSync   = require('browser-sync');
var reload        = browserSync.reload;

var AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
];

/**
 * gulp build:styles
 */
gulp.task('build:styles', function () {
    return gulp.src('app/styles/less/style.less')
        .pipe($.less())
        .on('error', console.error.bind(console))
        .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
        .pipe($.csslint())
        .pipe($.minifyCss())
        .pipe($.concat('style.css'))
        .pipe(gulp.dest('./'))
        .pipe($.size({title: 'styles'}));
});

/**
 * gulp build:scripts
 */
gulp.task('build:scripts', function () {
    return gulp.src('app/**/*.js')
        .pipe($.changed('dist/'))
        .pipe($.uglify())
        .pipe(gulp.dest('dist/'))
        .pipe($.size({title: 'scripts'}));
});

/**
 * gulp build:templates
 */
gulp.task('build:templates', function () {
    return gulp.src('app/templates/**/*.{html,dust}')
        .pipe($.changed('dist/templates/'))
        .pipe($.dust())
        .pipe(gulp.dest('dist/templates/'))
        .pipe($.size({title: 'templates'}));
});

/**
 * gulp build:images
 */
gulp.task('build:images', function () {
    return gulp.src('app/assets/images/**/*')
        .pipe($.changed('dist/assets/images/'))
        .pipe($.cache($.imagemin({
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/assets/images/'))
        .pipe($.size({title: 'images'}));
});

/**
 * gulp build:fonts
 */
gulp.task('build:fonts', function () {
    return gulp.src('app/assets/fonts/**/*.{eot,svg,ttf,woff}')
        .pipe($.flatten())
        .pipe(gulp.dest('dist/assets/fonts/'))
        .pipe($.size({title: 'fonts'}));
});

/**
 * gulp bower
 */
gulp.task('bower', function () {
    return $.bower()
        .pipe(gulp.dest('lib/'));
});

/**
 * gulp jshint
 */
gulp.task('jshint', function () {
    return gulp.src('app/**/*.js')
        .pipe(reload({stream: true, once: true}))
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

/**
 * gulp jasmine
 */
gulp.task('jasmine', function () {

    // var specRunner = require('./test/jasmine/config/test-init.js');

    // TODO: Jasmine + RequireJS
    return gulp.src('test/jasmine/config/test-init.js')
        .pipe($.coverage.instrument({
            pattern: ['**/*.spec.js'],
            debugDirectory: 'debug'
        }))
        .pipe($.jasmine())
        .pipe($.coverage.report({
            outFile: 'test/jasmine/coverage.html'
        }));
});

/**
 * gulp phpunit
 */
gulp.task('phpunit', function () {
    return gulp.src('test/phpunit/**/test*.php')
        .pipe($.phpunit());
});

/**
 * gulp test
 */
gulp.task('test', ['jasmine', 'phpunit']);

/**
 * gulp watch
 */
gulp.task('watch', function () {

    browserSync({
        notify: false,
        server: {
            baseDir: ['.', '.tmp', 'app']
        }
    });

    /**
     * Rebuild on changed sources:
     */
    gulp.watch('test/jasmine/specs/**/*.spec.js',          reload);
    gulp.watch('index.{html,php}',                         reload);
    gulp.watch('app/**/*.js',                              ['build:scripts', reload]);
    gulp.watch('app/templates/**/*.{html,dust}',           ['build:templates', reload]);
    gulp.watch('app/styles/**/*.{css,less,scss}',          ['build:styles', reload]);
    gulp.watch('app/assets/images/**/*',                   ['build:images', reload]);
    gulp.watch('app/assets/fonts/**/*.{eot,svg,ttf,woff}', ['build:fonts', reload]);
});

/**
 * gulp clean
 */
gulp.task('clean', function () {
    return gulp.src(['dist/', 'lib/'], { read: false })
        .pipe($.rimraf());
});

/**
 * gulp build
 */
gulp.task('build', function (cb) {
    runSequence( 'bower', ['jshint', 'build:scripts', 'build:templates', 'build:styles', 'build:images', 'build:fonts'], cb );
});

/**
 * gulp
 */
gulp.task('default', ['clean'], function () {
    gulp.start(['build']);
});

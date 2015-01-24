/* global require */

'use strict';

var gulp        = require('gulp'),
    del         = require('del'),
    gutil       = require('gulp-util'),
    $           = require('gulp-load-plugins')(),
    bowerFiles  = require('bower-files')({'dev': true}),
    browserSync = require('browser-sync'),
    reload      = browserSync.reload;

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

function _onError (error) {
  gutil.log(gutil.colors.red(error.message));
}

/**
 * gulp build:styles
 */
gulp.task('build:styles', function () {
  return gulp.src('app/styles/less/style.less')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
      .pipe($.less())
        .on('error', _onError)
      .pipe($.autoprefixer({ browsers: AUTOPREFIXER_BROWSERS }))
      .pipe($.minifyCss())
      .pipe($.concat('style.css'))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('dist/assets/styles/'))
    .pipe($.size({title: 'styles'}));
});

/**
 * gulp build:scripts
 *
 * Due to a bug in gulp-uglify, sourcemaps aren't behaving correctly.
 * As a workaround, edit `node_modules/gulp-uglify/index.js` and add the
 * following at line 85 (before `applySourceMap(file, mangled.map);`):
 *
 *    mangled.map = JSON.parse(mangled.map);
 *    mangled.map.sources = file.sourceMap.sources;
 */
gulp.task('build:scripts', ['build:templates'], function () {
  return gulp.src('app/**/*.js')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
      .pipe($.changed('dist/'))
      .pipe($.uglify())
        .on('error', _onError)
    .pipe($.sourcemaps.write('.'))
//    .pipe(gulp.dest('dist/'))
    .pipe($.size({title: 'scripts'}));
});

/**
 * gulp build:templates
 */
gulp.task('build:templates', function () {
  return gulp.src('app/templates/**/*.{html,dust}')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
      .pipe($.dust())
        .on('error', _onError)
      // AMDify dust modules
      .pipe($.replace(/^\(function\(\)\{/, 'define(["dust"],function(dust){'))
      .pipe($.replace(/\(\);$/, ';'))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('app/templates-compiled/'))
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
  return gulp.src(['app/assets/fonts/**/*.{eot,svg,ttf,woff}', 'lib/fonts/**/*.{eot,svg,ttf,woff}'])
    .pipe($.flatten())
    .pipe(gulp.dest('dist/assets/fonts/'))
    .pipe($.size({title: 'fonts'}));
});

/**
 * gulp bower
 */
gulp.task('bower', function () {
  gulp.src(bowerFiles.js)
    .pipe($.uglify())
    .pipe(gulp.dest('lib/'));

  gulp.src(bowerFiles.css)
    .pipe($.minifyCss())
    .pipe(gulp.dest('lib/css/'));

  gulp.src(bowerFiles.eot.concat(bowerFiles.svg).concat(bowerFiles.ttf).concat(bowerFiles.woff))
    .pipe(gulp.dest('lib/fonts/'));
});

/**
 * gulp jshint
 */
gulp.task('jshint', function () {
  return gulp.src(['app/**/*.js', '!app/templates-compiled/**/*'])
    .pipe(reload({stream: true, once: true}))
    .pipe($.plumber())
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

/**
 * gulp jasmine
 */
gulp.task('jasmine', function () {
  // var specRunner = require('./test/jasmine/config/test-init.js');
  //
  return gulp.src('test/jasmine/config/test-init.js')
    .pipe($.plumber())
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
 * gulp test:server
 */
gulp.task('test:server', function () {
  browserSync({
    notify: true,
    server: {
      baseDir: './',
    },
    logLevel: 'debug'
  });
});

/**
 * gulp watch
 */
gulp.task('watch', function () {
  gulp.watch(['app/**/*.js', 'lib/**/*.js'],
    ['build:scripts', 'jshint']);

  gulp.watch('app/templates/**/*.{html,dust}',
    ['build:templates']);

  gulp.watch(['app/styles/**/*.{css,less,scss}', 'lib/**/*.{css,less,scss}'],
    ['build:styles']);

  gulp.watch(['app/assets/fonts/**/*.{eot,svg,ttf,woff}', 'lib/fonts/**/*.{eot,svg,ttf,woff}'],
    ['build:fonts']);

  gulp.watch('app/assets/images/**/*',
    ['build:images']);
});

/**
 * gulp watch:server
 */
gulp.task('watch:server', function () {

  browserSync({
    notify: true,
    proxy: 'b3.dev',
    port: 8080,
    logLevel: 'debug'
  });

  /**
   * Rebuild on changed sources.
   */

  gulp.watch('test/jasmine/specs/**/*.spec.js',
    reload);

  gulp.watch(['index.html', '*.php'],
    reload);

  gulp.watch(['app/**/*.js', 'lib/**/*.js'],
    ['build:scripts', 'jshint', reload]);

  gulp.watch('app/templates/**/*.{html,dust}',
    ['build:templates', reload]);

  gulp.watch(['app/styles/**/*.{css,less,scss}', 'lib/**/*.{css,less,scss}'],
    ['build:styles', reload]);

  gulp.watch(['app/assets/fonts/**/*.{eot,svg,ttf,woff}', 'lib/fonts/**/*.{eot,svg,ttf,woff}'],
    ['build:fonts', reload]);

  gulp.watch('app/assets/images/**/*',
    ['build:images', reload]);
});

/**
 * gulp clean
 */
gulp.task('clean', function (cb) {
  return del(['app/templates-compiled/', 'dist/', 'lib/'], cb);
});

/**
 * gulp rebuild
 */
gulp.task('rebuild', ['clean'], function () {
  gulp.start('build');
});

/**
 * gulp build
 */
gulp.task('build', ['bower'], function () {
  gulp.start('jshint', 'build:scripts', 'build:templates', 'build:styles', 'build:images', 'build:fonts');
});

/**
 * gulp
 */
gulp.task('default', function () {
  gulp.start('build');
});

/* global require */

'use strict';

var gulp            = require('gulp'),
    browserSync     = require('browser-sync'),
    autoprefixer    = require('gulp-autoprefixer'),
    concat          = require('gulp-concat'),
    gulpIf          = require('gulp-if'),
    sass            = require('gulp-sass'),
    scssLint        = require('gulp-scss-lint'),
    scssLintStylish = require('gulp-scss-lint-stylish'),
    minifyCss       = require('gulp-minify-css'),
    plumber         = require('gulp-plumber'),
    size            = require('gulp-size'),
    sourcemaps      = require('gulp-sourcemaps'),
    handleErrors    = require('../../util/handleErrors'),
    config          = require('../../config');

gulp.task('build:styles', ['build:images'], function() {
  return gulp.src(config.sass.src)
    .pipe(plumber())
    .pipe(scssLint({customReport: scssLintStylish}))
    .pipe(gulpIf(config.debug, sourcemaps.init()))
    .pipe(sass(config.sass.settings))
      .on('error', handleErrors)
    .pipe(autoprefixer(config.autoprefixer))
    .pipe(minifyCss({keepSpecialComments: '*'}))
    .pipe(gulpIf(config.debug, sourcemaps.write()))
    .pipe(gulp.dest(config.sass.dest))
    .pipe(browserSync.reload({stream: true}))
    .pipe(size({title: 'build:styles'}));
});

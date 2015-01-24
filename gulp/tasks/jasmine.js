/* global require */

"use strict";

var gulp        = require("gulp"),
    browserSync = require("browser-sync"),
    coverage    = require("gulp-coverage"),
    jasmine     = require("gulp-jasmine"),
    plumber     = require("gulp-plumber"),
    config      = require("../config");

gulp.task("jasmine", function () {
  browserSync(config.jasmine.browserSync);

  gulp.watch(config.jasmine.specs,
    browserSync.reload);

  gulp.watch(['index.html', '**/*.php'],
    browserSync.reload);

  gulp.watch([config.scripts.src, config.lib + "**/*.js"],
    ['build:scripts', 'jshint']);

  gulp.watch(config.dust.src,
    ['build:templates']);
});

/*
gulp.task("jasmine", function () {
  return gulp.src(config.jasmine.runner)
    .pipe(plumber())
    .pipe(coverage.instrument(config.coverage.instrument))
    .pipe(jasmine())
    .pipe(coverage.report(config.coverage.report));
});
*/

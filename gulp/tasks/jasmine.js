/* global require */

"use strict";

var gulp     = require("gulp"),
    coverage = require("gulp-coverage"),
    jasmine  = require("gulp-jasmine"),
    plumber  = require("gulp-plumber"),
    config   = require("../config");

gulp.task('jasmine', function () {
  // var specRunner = require("./" + config.jasmine.runner);
  //
  return gulp.src(config.jasmine.runner)
    .pipe(plumber())
    .pipe(coverage.instrument(config.coverage.instrument))
    .pipe(jasmine())
    .pipe(coverage.report(config.coverage.report));
});

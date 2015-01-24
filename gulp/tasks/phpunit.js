/* global require */

"use strict";

var gulp    = require("gulp"),
    phpunit = require("gulp-phpunit"),
    config  = require("../config");

gulp.task('phpunit', function () {
  return gulp.src(config.phpunit.src)
    .pipe(phpunit());
});

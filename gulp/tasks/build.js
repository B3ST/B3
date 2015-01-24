/* global require */

"use strict";

var gulp = require("gulp");

gulp.task('build', ['bower'], function () {
  gulp.start('jshint', 'build:scripts', 'build:templates', 'build:styles', 'build:images', 'build:fonts');
});

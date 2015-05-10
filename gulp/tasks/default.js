/* global require */

"use strict";

var gulp   = require("gulp"),
    config = require("../config");

gulp.task('default', function () {
  gulp.start('watch');
});

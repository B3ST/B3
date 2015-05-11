/* global require */

"use strict";

var gulp       = require("gulp"),
    config     = require("../config"),
    bowerFiles = require('bower-files')({'dev': config.debug});

gulp.task('bower', function () {
  gulp.src(bowerFiles.js)
    .pipe(gulp.dest(config.lib));

  gulp.src(bowerFiles.css)
    .pipe(gulp.dest(config.lib + "css/"));
});

/* global require */

"use strict";

var gulp        = require("gulp"),
    jshint      = require("gulp-jshint"),
    plumber     = require("gulp-plumber"),
    gulpIf      = require("gulp-if"),
    browserSync = require("browser-sync"),
    config      = require("../config");

gulp.task("jshint", function () {
  return gulp.src(config.jshint.src)
    .pipe(browserSync.reload({stream: true, once: true}))
    .pipe(plumber())
    .pipe(jshint())
      .pipe(jshint.reporter(config.jshint.reporter))
    .pipe(gulpIf(!browserSync.active, jshint.reporter("fail")));
});

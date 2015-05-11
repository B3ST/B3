/* global require */

"use strict";

var gulp        = require("gulp"),
    browserSync = require("browser-sync"),
    size        = require("gulp-size"),
    config      = require("../../config");

gulp.task("build:fonts", function () {
  return gulp.src(config.fonts.src)
    .pipe(gulp.dest(config.fonts.dest))
    .pipe(browserSync.reload({stream: true}))
    .pipe(size({title: "build:fonts"}));
});

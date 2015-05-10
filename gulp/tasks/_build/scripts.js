/* global require */

"use strict";

var gulp         = require("gulp"),
    browserSync  = require("browser-sync"),
    changed      = require("gulp-changed"),
    gulpIf       = require("gulp-if"),
    uglify       = require("gulp-uglify"),
    plumber      = require("gulp-plumber"),
    size         = require("gulp-size"),
    sourcemaps   = require("gulp-sourcemaps"),
    handleErrors = require("../../util/handleErrors"),
    config       = require("../../config");

gulp.task("build:scripts", ["build:templates"], function () {
  return gulp.src(config.scripts.src)
    .pipe(plumber())
    .pipe(gulpIf(config.debug, sourcemaps.init()))
    .pipe(changed(config.scripts.dest))
    .pipe(uglify())
      .on("error", handleErrors)
    .pipe(gulpIf(config.debug, sourcemaps.write(".")))
    .pipe(gulp.dest(config.scripts.dest))
    .pipe(browserSync.reload({stream: true}))
    .pipe(size({title: "build:scripts"}));
});

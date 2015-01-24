/* global require */

"use strict";

var gulp         = require("gulp"),
    browserSync  = require("browser-sync"),
    autoprefixer = require("gulp-autoprefixer"),
    concat       = require("gulp-concat"),
    gulpIf       = require("gulp-if"),
    less         = require("gulp-less"),
    minifyCss    = require("gulp-minify-css"),
    plumber      = require("gulp-plumber"),
    size         = require("gulp-size"),
    sourcemaps   = require("gulp-sourcemaps"),
    handleErrors = require("../../util/handleErrors"),
    config       = require("../../config");

gulp.task("build:styles", ["build:images"], function() {
  return gulp.src(config.less.src)
    .pipe(plumber())
    .pipe(gulpIf(config.debug, sourcemaps.init()))
      .pipe(less())
        .on("error", handleErrors)
      .pipe(autoprefixer(config.autoprefixer))
      .pipe(minifyCss())
      .pipe(concat(config.less.concat))
    .pipe(gulpIf(config.debug, sourcemaps.write(".")))
    .pipe(gulp.dest(config.less.dest))
    .pipe(browserSync.reload({stream: true}))
    .pipe(size({title: "build:styles"}));
});

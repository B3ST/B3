/* global require */

"use strict";

var gulp         = require("gulp"),
    browserSync  = require("browser-sync"),
    cache        = require("gulp-cache"),
    changed      = require("gulp-changed"),
    imagemin     = require("gulp-imagemin"),
    size         = require("gulp-size"),
    config       = require("../../config");

gulp.task("build:images", function () {
  return gulp.src(config.images.src)
    .pipe(changed(config.images.dest))
    .pipe(cache(imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest(config.images.dest))
    .pipe(browserSync.reload({stream: true}))
    .pipe(size({title: "build:images"}));
});

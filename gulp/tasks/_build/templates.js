/* global require */

"use strict";

var gulp         = require("gulp"),
    browserSync  = require("browser-sync"),
    changed      = require("gulp-changed"),
    dust         = require("gulp-dust"),
    gulpIf       = require("gulp-if"),
    insert       = require("gulp-insert"),
    plumber      = require("gulp-plumber"),
    size         = require("gulp-size"),
    sourcemaps   = require("gulp-sourcemaps"),
    handleErrors = require("../../util/handleErrors"),
    config       = require("../../config");

gulp.task('build:templates', function () {
  return gulp.src(config.dust.src)
    .pipe(plumber())
    .pipe(gulpIf(config.debug, sourcemaps.init()))
    .pipe(changed(config.dust.dest))
    .pipe(dust())
      .on('error', handleErrors)
      // AMDify dust modules
      .pipe(insert.prepend('define(["dust"],function(dust){return '))
      .pipe(insert.append('});'))
    .pipe(gulpIf(config.debug, sourcemaps.write('.')))
    .pipe(gulp.dest(config.dust.dest))
    .pipe(browserSync.reload({stream: true}))
    .pipe(size({title: 'build:templates'}));
});

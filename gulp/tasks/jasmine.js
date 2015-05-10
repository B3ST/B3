/* global require */

"use strict";

var gulp        = require("gulp"),
    browserSync = require("browser-sync"),
    config      = require("../config");

gulp.task("jasmine", function () {
  browserSync(config.jasmine.browserSync);

  gulp.watch(config.jasmine.specs,
    browserSync.reload);

  gulp.watch(['index.html', '**/*.php'],
    browserSync.reload);

  gulp.watch([config.scripts.src, config.lib + "**/*.js"],
    ['build:scripts', 'jshint']);

  gulp.watch(config.dust.src,
    ['build:templates']);
});

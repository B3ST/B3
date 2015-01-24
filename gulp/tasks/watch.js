/* global require */

"use strict";

var gulp      = require("gulp"),
  browserSync = require("browser-sync"),
  config      = require("../config");

gulp.task('watch', function () {

  browserSync(config.browserSync);

  gulp.watch(config.jasmine.specs,
    browserSync.reload);

  gulp.watch(['index.html', '**/*.php'],
    browserSync.reload);

  gulp.watch([config.scripts.src, config.lib + "**/*.js"],
    ['build:scripts', 'jshint']);

  gulp.watch(config.dust.src,
    ['build:templates']);

  gulp.watch([config.src + "**/*.{css,less,sass,scss}", config.lib + "**/*.{css,less,sass,scss}"],
    ['build:styles']);

  gulp.watch(config.fonts.src,
    ['build:fonts']);

  gulp.watch(config.images.src,
    ['build:images']);
});

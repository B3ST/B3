/* global require */

"use strict";

var gulp       = require("gulp"),
    uglify     = require("gulp-uglify"),
    minifyCss  = require("gulp-minify-css"),
    config     = require("../config"),
    bowerFiles = require('bower-files')({'dev': config.debug});

gulp.task('bower', function () {
  gulp.src(bowerFiles.js)
    .pipe(uglify())
    .pipe(gulp.dest(config.lib));

  gulp.src(bowerFiles.css)
    .pipe(minifyCss())
    .pipe(gulp.dest(config.lib + "css/"));

  gulp.src(bowerFiles.eot.concat(bowerFiles.svg).concat(bowerFiles.ttf).concat(bowerFiles.woff))
    .pipe(gulp.dest(config.lib + "fonts/"));
});

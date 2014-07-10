'use strict';

var gulp          = require('gulp');
var $             = require('gulp-load-plugins')();
var jshintStylish = require('jshint-stylish');

var source = {
    app:        './app/**/*.js',
    styles:     ['./app/styles/less/**/*.less', './app/styles/less/**/*.css'],
    stylesMain: './app/styles/less/style.less',
    templates:  './app/templates/**/*.html',
    images:     ['./app/assets/images/**/*.png', './app/assets/images/**/*.jpg', './app/assets/images/**/*.jpeg'],
    fonts:      ['./app/assets/fonts/**/*.otf', './app/assets/fonts/**/*.ttf', './app/assets/fonts/**/*.woff'],
};

var dest = {
    app:       './dist/app',
    styles:    '.',
    templates: './dist/app/templates',
    images:    './dist/app/assets/images',
    fonts:     './dist/app/assets/fonts'
};

var root = '.';
var dist = './dist';

gulp.task('styles', function () {
    // TODO: $.csslint()
    return gulp.src(source.stylesMain)
        .pipe($.less())
        .pipe($.autoprefixer('last 1 version'))
        .pipe($.minifyCss())
        .pipe(gulp.dest(dest.styles))
        .pipe($.size());
});

gulp.task('scripts', function () {
    // TODO:
    return gulp.src(source.app)
        .pipe($.jshint())
        .pipe($.jshint.reporter(jshintStylish))
        .pipe($.uglify())
        .pipe(gulp.dest(dest.app))
        .pipe($.size());
});

gulp.task('templates', function () {
    return gulp.src(source.templates)
        .pipe(gulp.dest(dest.templates));
});

gulp.task('images', function () {
    // TODO: Image compress.
    return gulp.src(source.images)
        .pipe(gulp.dest(dest.images));
});

gulp.task('fonts', function () {
    return gulp.src(source.fonts)
        .pipe(gulp.dest(dest.fonts));
});

gulp.task('watch', function () {
    gulp.run(['scripts', 'templates', 'styles', 'images', 'fonts']);

    gulp.watch(source.app,       ['scripts']);
    gulp.watch(source.templates, ['templates']);
    gulp.watch(source.styles,    ['styles']);
    gulp.watch(source.images,    ['images']);
    gulp.watch(source.fonts,     ['fonts']);
});

gulp.task('build', ['scripts', 'templates', 'styles', 'images', 'fonts'], function () {

});

gulp.task('test', ['build'], function () {
    // TODO: $.jshint()
    // TODO: $.jasmine()
    // TODO: $.complexity()
    // TODO: $.coverage()
});

gulp.task('default', ['build'], function () {

});
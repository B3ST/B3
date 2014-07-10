'use strict';

var gulp          = require('gulp');
var $             = require('gulp-load-plugins')();
var jshintStylish = require('jshint-stylish');

var source = {
    app:       './app/**/*.js',
    style:     './app/styles/less/style.less',
    css:       './app/styles/**/*.css',
    less:      './app/styles/less/**/*.less',
    sass:      './app/styles/sass/**/*.scss',
    templates: './app/templates/**/*.html',
    images:    './app/assets/images/**/*',
    fonts:     './app/assets/fonts/**/*.{eot,svg,ttf,woff}',
};

var dest = {
    app:       './dist',
    lib:       './lib',
    style:     '.',
    templates: './dist/templates',
    images:    './dist/assets/images',
    fonts:     './dist/assets/fonts'
};

gulp.task('styles', function () {
    return gulp.src(source.style)
        .pipe($.less())
        .pipe($.autoprefixer('last 1 version'))
        .pipe($.csslint())
        .pipe($.minifyCss())
        .pipe($.concat('style.css'))
        .pipe(gulp.dest(dest.style))
        .pipe($.size());
});

gulp.task('scripts', function () {
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
    return gulp.src(source.images)
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest(dest.images))
        .pipe($.size());
});

gulp.task('fonts', function () {
    return $.bowerFiles()
        .pipe($.filter(source.fonts))
        .pipe($.flatten())
        .pipe(gulp.dest(dest.fonts))
        .pipe($.size());
});

gulp.task('bower', function () {
    return $.bower()
        .pipe(gulp.dest(dest.lib));
});

gulp.task('watch', function () {
    var server = $.livereload();

    gulp.watch([
        source.app,
        source.css,
        source.less,
        source.sass,
        source.templates,
        source.images,
        source.fonts,
    ]).on('change', function (file) {
        server.changed(file.path);
    });

    gulp.watch(source.app, ['scripts']);
    gulp.watch(source.templates, ['templates']);
    gulp.watch([source.css, source.less, source.sass], ['styles']);
    gulp.watch(source.images, ['images']);
    gulp.watch(source.fonts, ['fonts']);
});

gulp.task('test', ['build'], function () {
    // TODO: $.coverage()
    return gulp.src('./test/jasmine/config/test-init.js')
        .pipe($.jasmine());
});

gulp.task('clean', function () {
    return gulp.src([dest.app, dest.lib], { read: false })
        .pipe($.clean());
});

gulp.task('build', ['bower', 'scripts', 'templates', 'styles', 'images', 'fonts']);

gulp.task('default', ['clean'], function () {
    gulp.start(['build']);
});
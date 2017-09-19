'use strict';

const gulp = require('gulp');
const runSequence = require('run-sequence');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const webserver = require('gulp-webserver');
const eslint = require('gulp-eslint');
const streamify = require('gulp-streamify');
const uglify = require('gulp-uglify');

gulp.task('build', () => {
    runSequence(['browserify', 'html', 'css', 'fonts', 'images']);
});

gulp.task('browserify', () => {
    browserify('./js/app.js', {
        debug:   true,
        require: ['moment'],
        transform: ['jstify'],
    })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('html', () => {
    gulp.src('html/index.html')
        .pipe(gulp.dest('./dist/'));
});

gulp.task('css', () => {
    gulp.src('./css/**')
        .pipe(gulp.dest('./dist/css/'));
});

gulp.task('fonts', () => {
    gulp.src('./fonts/**')
        .pipe(gulp.dest('./dist/fonts/'));
});

gulp.task('images', () => {
    gulp.src('./images/**')
        .pipe(gulp.dest('./dist/images/'));
});

gulp.task('watch', () => {
    gulp.watch(['./js/**/*.js', './js/**/*.jst', './css/**/*.css', './html/index.html'], ['build', 'lint']);
});

gulp.task('server', () => {
    gulp.src('./')
        .pipe(webserver({
            host: '127.0.0.1',
            livereload: true
        })
    );
});

gulp.task('lint', () => {
    gulp.src('./js/**/*.js')
        .pipe(eslint({
            fix: true
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('default', ['build', 'watch', 'server', 'lint']);

"use strict";

const gulp      = require('gulp'),
      less = require('gulp-less'),
      uglify = require('gulp-uglify'),
      cleanCss = require('gulp-clean-css'),
      ts = require('gulp-typescript'),
      tsProject = ts.createProject('tsconfig.json');

gulp.task('default', ['less', 'ts', 'img', 'html']);

gulp.task('less', () => {
	return gulp.src('src/less/*.less', {base: 'src/less'})
		.pipe(less())
		.pipe(cleanCss())
		.pipe(gulp.dest('public/css'));
});

gulp.task('ts', () => {
	return tsProject.src()
		.pipe(tsProject())
		.js.pipe(gulp.dest('public'));
});

gulp.task('img', () => {
	return gulp.src('src/img/*', {base: 'src'})
		.pipe(gulp.dest('public'));
});

gulp.task('html', () => {
	return gulp.src('src/*.html', {base: 'src'})
		.pipe(gulp.dest('public'));
});

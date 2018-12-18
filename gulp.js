/*jshint node: true, esversion: 6*/
/*global goog, Map, let */

"use strict";

const
	child_process = require('child_process'),
	gulp = require('gulp'),
	newer = require('gulp-newer'),
	imagemin = require('gulp-imagemin'),
	htmlclean = require('gulp-htmlclean'),
	concat = require('gulp-concat'),
	deporder = require('gulp-deporder'),
	stripdebug = require('gulp-strip-debug'),
	uglify = require('gulp-uglify');

// Folders
const folder = {
	src: 'src/',
	build: 'build/'
};

// Build rust server
const buildCommand = "cargo run";
gulp.task('rust', () => {
	child_process.exec(buildCommand, (error, stdout, stderr) => {
		console.log(stdout);
		console.log(stderr);
	});
});

// Compress images
gulp.task('images', () => {
	var out = folder.build + 'images/';
	return gulp.src(folder.src + 'images/**/*')
	  .pipe(newer(out))
	  .pipe(imagemin({ optimizationLevel: 5 }))
	  .pipe(gulp.dest(out));
});  

// HTML processing
gulp.task('html', gulp.series('images', () => {
	var out = folder.build + 'html/',
		page = gulp.src(folder.src + 'html/**/*')
			.pipe(newer(out))
			.pipe(htmlclean());

	return page.pipe(gulp.dest(out));
}));
  
// JavaScript processing
gulp.task('js', () => {
	var jsbuild = gulp.src(folder.src + 'js/**/*')
		.pipe(deporder())
		.pipe(concat('main.js'))
		.pipe(stripdebug())
		.pipe(uglify());

	return jsbuild.pipe(gulp.dest(folder.build + 'js/'));  
});

// Watch everything
gulp.task('watch', () => {
  
	// rust changes
	gulp.watch(folder.src + 'rust/**/*', ['rust']);

	// image changes
	gulp.watch(folder.src + 'images/**/*', ['images']);
  
	// html changes
	gulp.watch(folder.src + 'html/**/*', ['html']);
  
	// javascript changes
	gulp.watch(folder.src + 'js/**/*', ['js']);
  
});  

gulp.task('run', gulp.parallel('rust', 'html', 'js'));
  
gulp.task('default', gulp.series('run', 'watch'));
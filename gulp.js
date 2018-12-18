import { task } from 'gulp';
import { exec } from 'child_process';

gulp = require('gulp');
newer = require('gulp-newer');
imagemin = require('gulp-imagemin');
htmlclean = require('gulp-htmlclean');

// Folders
folder = {
	src: 'src/',
	build: 'build/'
};

// Rust server
var buildCommand = "cargo run";

// Compress images
task('images', () => {
	var out = folder.build + 'images/';
	return gulp.src(folder.src + 'images/**/*')
	  .pipe(newer(out))
	  .pipe(imagemin({ optimizationLevel: 5 }))
	  .pipe(gulp.dest(out));
});  

// Build rust server
task('build', () => {
	exec(buildCommand, (error, stdout, stderr) => {
		console.log(stdout);
		console.log(stderr);
	});
});

task('watch', () => {
	gulp.watch('src/*.cpp', ['build']);
	gulp.watch('include/*.h', ['build']);
});

// HTML processing
task('html', ['images'], function() {
	var
	  out = folder.build + 'html/',
	  page = gulp.src(folder.src + 'html/**/*')
		.pipe(newer(out));
  
	// minify production code
	if (!devBuild) {
	  page = page.pipe(htmlclean());
	}
  
	return page.pipe(gulp.dest(out));
  });
  

task('default', ['build', 'watch'], () => {} );
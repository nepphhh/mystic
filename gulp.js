import { task, watch } from 'gulp';
import { exec } from 'child_process';

newer = require('gulp-newer'),
imagemin = require('gulp-imagemin'),

// Folders
folder = {
	src: 'src/',
	build: 'build/'
};

// Rust server
var buildCommand = "cargo run";

// Compress images
gulp.task('images', () => {
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
	watch('src/*.cpp', ['build']);
	watch('include/*.h', ['build']);
});

task('default', ['build', 'watch'], () => {} );
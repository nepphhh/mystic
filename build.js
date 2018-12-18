import { task, watch } from 'gulp';
import { exec } from 'child_process';


var buildCommand = "cargo run";

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
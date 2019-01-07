/*jshint esversion: 6*/
/*global require, module, exports, console, process*/
/*jshint -W097*/

"use strict";

const
    child   = require('child_process'),
    os      = require('os'),
    gulp    = require("gulp"),
    rev     = require("gulp-rev"),  
    clean   = require("gulp-rev-delete-original"),
    rewrite = require("gulp-rev-rewrite"),
    rimraf  = require('rimraf'),
    webpack = require("webpack-stream"),
    colors  = require('colors');

var server = null;

// Clear the old things
gulp.task("clear-dist", done => {
    // Clear the dist folder completely
    rimraf.sync('dist', {}, () => console.log('Old dist folder cleared.'));
    // The callback function tells gulp that this process is finished
    done();
});  

/***************
 * SERVER STUFF
 */

// Compile the websocket server
const ws_server = (os.platform() == 'win32') ? "ws-server.exe" : "ws-server";
gulp.task("compile-ws-server", done => {
    // This launches the go compiler and creates a server executable which will pipe output
    const build = child.spawnSync("go", ["build", "-o", "./dist/" + ws_server, "-i", "./src"], { stdio: 'pipe', encoding: 'utf-8' });
    // Error handling
    const output = String(build.output).split('\n');
    for (var line in output) console.log(output[line].red);
    // The callback function tells gulp that this process is finished
    done(); 
});

// Launch the websocket server
gulp.task("launch-ws-server", done => {
    // Launch the compiled executable
    const server = child.execFile("ws-server.exe", { cwd: "./dist/" });
    server.stderr.on('data', data => console.log('server'.underline + ': ' + data));
    // The callback function tells gulp that this process is finished
    done(); 
});

// Consolidate all websocket server tasks
gulp.task("ws-server", gulp.series("compile-ws-server", "launch-ws-server"));

/***************
 * CLIENT STUFF
 */

// Move the client
gulp.task("move-client-files", () =>
    // This selects all files in src/client that do not end in .js and moves them to dist
    gulp.src(["src/client/**/*.*", "!src/client/**/*.js"])
        .pipe(gulp.dest("dist/client/"))
);

// Prepare the client for browsers
gulp.task("build-js-client", () => 
    // Build using the webpack config and move it to dist
    webpack(require("./config/webpack.js"))
        .pipe(gulp.dest("dist/client/js/"))
);

// Rename the new client files so we can keep track of changes
gulp.task("track-revisions", () =>
    gulp.src(["dist/client/**/*.html",
              "dist/client/**/*.css",
              "dist/client/**/*.js",
              "dist/client/**/*.json",
              "dist/client/**/*.{jpg,png,jpeg,gif,svg}",
              "!dist/client/index.html",]) // We don't want to revision index.html
        .pipe(rev()) // Revision all files
        .pipe(clean()) // Remove the unrevved files
        .pipe(gulp.dest('dist/client/'))
        .pipe(rev.manifest({ path: "manifest.json" })) // Build the manifest of revisions
        .pipe(gulp.dest("dist/"))
);

// Make sure things still link to one another after revisioning
gulp.task("relink-revisions", done => {
    // Locate the manifest
    const manifest = gulp.src('dist/manifest.json');
    // Rewrite all references
    gulp.src('dist/client/**/*')
        .pipe(rewrite({ manifest }))
        .pipe(gulp.dest('dist/client/'));
    // Callback
    done();
});

// Consolidate all client tasks
gulp.task("client", gulp.series("move-client-files", "build-js-client", "track-revisions", "relink-revisions"));

// Start the server
gulp.task("default", gulp.series("clear-dist", gulp.parallel("ws-server", "client"))); 
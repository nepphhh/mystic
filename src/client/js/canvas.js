/*jshint browser: true*/
/*global require, module, exports, console*/
/*jshint esversion: 6*/
/*jshint -W097*/

"use strict";

// Requirements
const KEY = require("./lib/binds");

// Get canvas
const canvas = document.getElementById('gameCanvas');

// Set up primary command index
const cmd = {
    up: false,
    down: false,
    left: false,
    right: false,
    lmb: false,
    rmb: false,
    x: 0,
    y: 0,
};

// Command parsers
const parseKeys = () => {
    return (1 * cmd.up) | (2 * cmd.down) | (4 * cmd.left) | (8 * cmd.right);
};

// Set up listeners
module.exports = ws => {
        
    // On mouse move
    canvas.addEventListener('mousemove', mouse => {

    }, false);

    // On key pressed
    canvas.addEventListener('keydown', event => {        
        // Figure out what to do
        switch (event.keyCode) {
            case KEY.UP:
            case KEY.UP_ARROW: cmd.up = true; break;
            case KEY.DOWN:
            case KEY.DOWN_ARROW: cmd.down = true; break;
            case KEY.RIGHT:
            case KEY.RIGHT_ARROW: cmd.right = true; break;
            case KEY.LEFT:
            case KEY.LEFT_ARROW: cmd.left = true; break;     
        }
        
        // Talk about it
        ws.o('k', parseKeys());
    }, false);

    // On key lifted
    canvas.addEventListener('keyup', event => {    
        // Figure out what to do
        switch (event.keyCode) {
            case KEY.UP:
            case KEY.UP_ARROW: cmd.up = false; break;
            case KEY.DOWN:
            case KEY.DOWN_ARROW: cmd.down = false; break;
            case KEY.RIGHT:
            case KEY.RIGHT_ARROW: cmd.right = false; break;
            case KEY.LEFT:
            case KEY.LEFT_ARROW: cmd.left = false; break;     
        }
        
        // Talk about it
        ws.o('k', parseKeys());
    }, false);

    // On mouse pressed
    canvas.addEventListener("mousedown", mouse => {
        switch (mouse.button) {

        }
    }, false);

    // On mouse released
    canvas.addEventListener("mouseup", mouse => {
        switch (mouse.button) {

        }
    }, false);

    // Return the canvas object for whatever you need it for
    return canvas;
};
/*jshint browser: true*/
/*global require, module, exports, console*/
/*jshint esversion: 6*/
/*jshint -W097*/

"use strict";

// Requirements
const ws = require("./websocket")("8080");
    // ws.i() recieves data
    // ws.o() sends a message
const cv = require("./canvas")(ws);
    // cv.canvas is the canvas element
    // cv.cmd is the command stack
        // up, down, left, right, lmb, rmb, x, y
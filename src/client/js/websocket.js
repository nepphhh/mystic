/*jshint browser: true*/
/*global require, module, exports, console*/
/*jshint esversion: 6*/
/*jshint -W097*/

"use strict";

// Requirements
const protocol = require("./lib/fasttalk");

// Get the websocket definition
window.WebSocket = window.WebSocket || window.MozWebSocket;

// Initalization
module.exports = port => {

    // Make a new websocket
    const socket = new WebSocket('ws://' + window.location.hostname + ':' + port + "/ws");

    // Socket properties
    socket.binaryType = 'arraybuffer';
    socket.open = false;

    // The talking function (this method is public!)
    const talk = (...message) => {

        // Make sure the socket is open before we do anything
        if (!socket.open) return 1;

        // Otherwise send the message
        socket.send(protocol.encode(message));

    }; 

    // What to do when opened for the first time
    socket.onopen = () => {

        // Mark the socket open
        socket.open = true;

    };

    // Incoming messages
    socket.onmessage = message => {

        // Decode the message content
        const m = protocol.decode(message.data);

    };

    // What to do when the socket closes
    socket.onclose = () => {

        console.log('Socket closed.');

        // Mark it closed
        socket.open = false;    
    };

    // Error handling
    socket.onerror = error => console.log('WebSocket error: ' + error);

    // Export it
    return {
        o: talk,
    };
    
};
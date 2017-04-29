# node.js-splendor
This is a remake of a board game we like, written in Node.JS with a web frontend. Not intended for commercial use, just practice.

Authors:
  Cody Cornelison
  Cody Nichols
  
Main app is written in Node.JS using express and socket.io to communicate with the clients. The client is written in native HTML, CSS, and JavaScript. The client creates each DOM element programatically based on the instructions from the Node.JS backend, but doesn't do any of the logic on the clientside, because that can cause problems with userinjection (things).

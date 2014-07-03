// DEPENDENCIES
// ============
var express = require("express"),
  http = require("http"),
  port = (process.env.PORT || 8001),
  server = module.exports = express();

// SERVER CONFIGURATION
// ====================
server.configure(function() {

  server.use(express["static"](__dirname + "/../"));

  server.use(express.errorHandler({

    dumpExceptions: true,

    showStack: true

  }));

  server.use(server.router);
});

// SERVER
// ======

// Start Node.js Server
http.createServer(server).listen(port);

console.log('Welcome to B3!\n\nPlease go to http://localhost:' + port + '/test/jasmine/SpecRunner.html to start your tests');
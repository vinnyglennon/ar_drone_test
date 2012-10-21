var fs = require('fs')
  , connect = require('connect')
  , app = connect()
  , arDrone = require('ar-drone')
  , drone = arDrone.createClient()
  , io = require('socket.io').listen(app)
  , recordState = []
  , timeline = require('./timeline')

drone.disableEmergency();

var http = require('http');


var png = null;
var server = http.createServer(function(req, res) {

  if (!png) {
    png = drone.createPngStream({ log : process.stderr });
    png.on('error', function (err) {
        console.error('png stream ERROR: ' + err);
    });
  }

  res.writeHead(200, { 'Content-Type': 'multipart/x-mixed-replace; boundary=--daboundary' });
  png.on('data', sendPng);
  function sendPng(buffer) {
    console.log(buffer.length);
    res.write('--daboundary\nContent-Type: image/png\nContent-length: ' + buffer.length + '\n\n');
    res.write(buffer);

		require("fs").writeFile("out.png", buffer, "binary");

  }
});



server.listen(8000);


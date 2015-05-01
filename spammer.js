var PORT = process.env.PORT || 30000

var io = require('socket.io-client')('http://localhost:' + PORT);

io.on('connect', function() {
  var i = 0;
  setInterval(function() {
    io.emit('message', i++);
  }, 1);
});

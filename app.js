var app           = require('express')();
var http          = require('http').Server(app);
var io            = require('socket.io')(http);

var PORT = process.env.PORT || 30000;

app.get('/', function(req, res) {
  res.sendfile("index.html");
});

io.on('connection', function(socket) {
  console.log(socket.id);

  socket.on('message', function(m) {
    console.log('emitting', socket.id, m);
    socket.broadcast.emit('message', m);
  });
});

http.listen(PORT, function() {
  console.log("listening on *:" + PORT);
});

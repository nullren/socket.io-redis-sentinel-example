var app           = require('express')();
var http          = require('http').Server(app);
var io            = require('socket.io')(http);
var ra            = require('socket.io-redis');
var redis         = require('redis-sentinel').createClient;

var PORT = process.env.PORT || 30000;

app.get('/', function(req, res) {
  res.sendfile("index.html");
});

var SENTINELS = [
    {host: '127.0.0.1', port: 23460},
    {host: '127.0.0.1', port: 23461},
    {host: '127.0.0.1', port: 23462}
  ];

var pub = redis(SENTINELS, 'mymaster', { role: 'master' })
var sub = redis(SENTINELS, 'mymaster', { role: 'slave', detect_buffers: true })

io.adapter(ra({ pubClient: pub, subClient: sub }));

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

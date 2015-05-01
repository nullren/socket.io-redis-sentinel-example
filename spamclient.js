var PORT = process.env.PORT || 30000

var io = require('socket.io-client')('http://localhost:' + PORT);

var last = 0
var timer

function updateLast(d) {
  clearTimeout(timer)
  last = d

  timer = setTimeout(function() {
    console.log("stale data, held", last, "for 100ms")
  }, 100)
}

io.on('message', function(data) {
  if (data < 1) console.log("started...")
  if (data - last > 1) console.log("skipped", data - last, "messages")
  updateLast(data)
});

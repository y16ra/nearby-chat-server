var socketIO = require('socket.io');

module.exports = function (server) {
  var io = socketIO.listen(server);
  io.set({'log level': 3});

  // クライアントが接続してきたときの処理
  io.sockets.on('connection', function(socket) {
    // 接続イベントを送信
    socket.emit('connected');

    // メッセージを受けたときの処理
    socket.on('message', function(data) {
      // つながっているクライアント全員に送信
      console.log("data -> " + data.value);
      console.log("room -> " + data.room);
      console.log("name -> " + data.name);
      io.sockets.emit('message', data.value);
    });

    // Roomへ入室
    socket.on('subscribe', function(data) {
      socket.join(data.room, function() {
        console.log("subscribe to " + data.room + ", rooms " + socket.rooms);
      });
    });
    // Roomから退出
    socket.on('unsubscribe', function(data) {
      // leave methodが指定したルーム名が無いときに別のルームから退出させてしまうので自前で実装
      if (socket.rooms.indexOf(data.room) < 0) {
        console.log("Not found room :" + data.room);
        console.log("rooms " + socket.rooms);
      } else {
        socket.leave(data.room, function() {
          console.log("unsubscribe to " + data.room + ", rooms " + socket.rooms);
        });
      }
    });

    // クライアントが切断したときの処理
    socket.on('disconnect', function(){
      console.log("disconnect");
    });

// setInterval(function() {
//   console.log("hoge [" + socket.rooms + "]");
// }, 5000);



  });


  // namespace付きにするかもしれないがいまは使ってない
  var chat = io.of('/chat').on('connection', function(socket){
    socket.emit('message', { value : "connect to chat"});

    socket.on('message', function(data) {
      console.log("/chat message");
      socket.broadcast.emit('message', { value: data });
    });
  });


};

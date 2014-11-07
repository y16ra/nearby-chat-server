var socketIO = require('socket.io');

module.exports = function (server) {
  var io = socketIO.listen(server);

  // クライアントが接続してきたときの処理
  io.sockets.on('connection', function(socket) {
    // 接続イベントを送信
    socket.emit('connected');

    // メッセージを受けたときの処理
    socket.on('message', function(data) {
      // つながっているクライアント全員に送信
      console.log("data -> " + data);
      io.sockets.emit('message', data);
    });
    // クライアントが切断したときの処理
    socket.on('disconnect', function(){
      console.log("disconnect");
    });
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

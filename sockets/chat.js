var debug = require('debug')('nearby-chat-server:chat');
require('date-utils');
var conf = require('config');

// モデルを定義
var model = require('../models/model');
var Room = model.Room;
var Sequence = model.Sequence;
// セッション情報取得用
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var parseCookie = require('cookie').parse;
// socket.io
var socketIO = require('socket.io');

module.exports = function (server) {
  var io = socketIO.listen(server);
  var ioredis = require('socket.io-redis');
  io.adapter(ioredis(
    { host: conf.redis.host , port: conf.redis.port }));

  var sessionStore = new RedisStore({prefix:conf.session.prefix});
  // クライアントが接続してきたときの処理
  var ns = io.of('/ws').on('connection', function(socket) {

    // 接続ユーザのセッションIDを取得
    var sid = require('cookie-parser').signedCookies(
      parseCookie(socket.request.headers.cookie), 
      conf.session.secret
    )[conf.session.sessionid];
    debug("connected user's sid -> " + sid);

    // 接続イベントを送信
    //socket.emit('connected');
    updateNearbyRooms(socket);

    // メッセージを受信したときの処理
    socket.on('message', function(data) {

      // 送信したユーザの情報を付与してメッセージを配信する
      sessionStore.get(sid, function(err, sessionData){
        debug("send user's sid -> " + sid);
        var user = sessionData.passport.user;
        data.id = user.twitter_id;
        data.image_url = user.profile_image_url;

        // メッセージの受信日時を取得
        data.dateTime = new Date().toFormat("YYYY/MM/DD HH24:MI");
        debug("data -> " + JSON.stringify(data));
        debug("joined rooms -> " + socket.rooms);

        // TODO メッセージを保存する

        // /wsに接続しているユーザ全体にメッセージを配信
        ns.emit('message', data);
      });

    });

    // Room作成
    socket.on('createRoom', function(data){
      debug("req data -> " + JSON.stringify(data));
      // TODO ルームを作成できる条件を検討する
      // 同じルーム名

      // ルームを作成
      room = new Room();
      room.name = data.roomName;
      room.location = data.location;
      room.save(function(cb){
        debug(cb);
        debug("room created.");
        debug("roomId: " + room.roomId);

        data.roomId = room.roomId;
        data.dateTime = room.created_at;
        debug("res data -> " + JSON.stringify(data));

        // TODO
        sessionStore.get(sid, function(err, sessionData){
          sessionData.room = room;
          sessionStore.set(sid, sessionData, function(err){
            if (err) {
              debug("err occured at sessionStore#set." + err);
            }
          });
        });

        updateNearbyRooms(socket);
        // io.sockets.emit('createRoom', data);
      });
    });
    // Roomへ入室
    socket.on('subscribe', function(data) {
      socket.join(data.roomId, function() {
        debug("================ subscribe to " + data.roomId + ", rooms " + socket.rooms);

        // TODO ルーム内の発言を復元する。(数時間分とか範囲を決めてストレージから取得)

      });
    });
    // Roomから退出
    socket.on('unsubscribe', function(data) {
      // leave methodが指定したルーム名が無いときに別のルームから退出させてしまうので自前で実装
      if (socket.rooms.indexOf(data.room) < 0) {
        debug("Not found room :" + data.room);
      } else {
        socket.leave(data.roomId, function() {
          debug("unsubscribe to " + data.room);
        });
      }
      debug("joined rooms ->" + socket.rooms);
    });

    socket.on('messageToRoom', function(data) {

      data.dateTime = new Date().toFormat("YYYY/MM/DD HH24:MI");

      debug("messageToRoom -> " + JSON.stringify(data));
      debug("joined rooms -> " + socket.rooms);
      debug("room -> " + data.room);

      // TODO メッセージを保存する


      // ルーム内のユーザにメッセージを送信する(自分に届かない版。使えるかも。)
      //socket.broadcast.to(data.room).emit('message', data);
      // ルーム内のユーザにメッセージを送信する
      ns.in(data.room).emit('message', data);


    });


    // クライアントが切断したときの処理
    socket.on('disconnect', function(){
      console.log("disconnect");
    });

    // ルーム一覧を一定時間ごとに更新する
    setInterval(function() {
      // sessionStore.get(sid, function(err, sessionData){
      //   debug("setInterval : sessiondata room -> " + JSON.stringify(sessionData.room));
      // });
      updateNearbyRooms(socket);
    }, 30000);



  });

  // ストレージからルーム情報を取得して配信する
  function updateNearbyRooms(socket) {
    Room.find({
        location: {$nearSphere: [130.0, 35.0]}
      },{},{limit: 5}, function(err, rooms){
      // debug(rooms);
      // for (var idx in rooms) {
      //   debug("find data : " + rooms[idx]);
      //   debug(rooms[idx].roomId);
      // }
      socket.emit('updateNearbyRooms', rooms);
    });  
  }

  // namespace付きにするかもしれないがいまは使ってない
  var chat = io.of('/chat').on('connection', function(socket){
    socket.emit('message', { value : "connect to chat"});

    socket.on('message', function(data) {
      console.log("/chat message");
      socket.broadcast.emit('message', { value: data });
    });
  });


};

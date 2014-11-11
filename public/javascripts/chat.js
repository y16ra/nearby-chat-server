var socket = io.connect('/');

function init(room) {
    socket.on('connected', function() {
        socket.emit('message', { room: room, value: "connected room is " + room } );
    });

    socket.on('message', function(data) {
        update(data);
    });
}
/*
 * メッセージ送信処理
 */
function send(room, name) {
    var comment = $('#comment').val();
    if (comment.length == 0) {
        return;
    }
    socket.send( { room: room, name: name, value: comment });
    $('#comment').val("");
}

// 入室
function subscribe(roomName) {
    socket.emit('subscribe', { room: roomName } );
}
// 退室
function unsubscribe(roomName) {
    socket.emit('unsubscribe', { room: roomName } );
}

/* ===============================================
 * 受信したメッセージをページに追加する処理
 */
function update(data) {
    var obj = $(document.createElement('blockquote'));
    obj.html(data + "<span class='arrow' />");
    $('#chatMessages').append(obj);
}




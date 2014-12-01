var socket = io.connect('/ws');

function init(room) {
    // ルームに入室する処理
    if (room) {
        subscribe(room);
    }
    
    socket.on('connected', function() {
        socket.emit('message', { room: room, value: "connected." } );
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
    if (comment.length === 0) {
        return;
    }
    if (room) {
        socket.emit('messageToRoom', { room: room, name: name, value: comment });
    } else {
        socket.send( { name: name, value: comment });
    }
    $('#comment').val("");
}

// 入室
function subscribe(roomName) {
    socket.emit('subscribe', { roomId: roomName } );
}
// 退室
function unsubscribe(roomName) {
    socket.emit('unsubscribe', { roomId: roomName } );
}

/* ===============================================
 * 受信したメッセージをページに追加する処理
 */
function update(data) {
    var obj = $(document.createElement('blockquote'));
    obj.html(data.value + "<span class='arrow' />");
    $('#chatMessages').append(obj);
    $('#chatMessages').append("<span id='dateTime'>" + data.dateTime + "</span>");
    $('#chatMessages').scrollTop($('#chatMessages')[0].scrollHeight);
}




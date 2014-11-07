var socket = io.connect('/');

function init(room) {
    socket.on('connected', function() {
        socket.emit('message', "connected romm is " + room);
    });

    socket.on('message', function(data) {
        update(data);
    });
}
/*
 * メッセージ送信処理
 */
function send(room, name) {
    var data = $('#comment').val();
    if (data.length == 0) {
        return;
    }
    socket.send(data);
    $('#comment').val("");
}
/* ===============================================
 * 受信したメッセージをページに追加する処理
 */
function update(data) {
    var obj = $(document.createElement('blockquote'));
    obj.html(data + "<span class='arrow' />");
    $('#chatMessages').append(obj);
}




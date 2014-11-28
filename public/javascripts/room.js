var socket = io.connect('/');

// socket.on('createRoom', function(data){
// 	updateRoom(data);
// });

socket.on('updateNearbyRooms', function(rooms){
    // 一旦、全てクリア
    clearRoom();
    // ルーム数分回す
    for (var i in rooms) {
        updateRoomEntity(rooms[i]);
    }
});

function createRoom() {
    var roomName = $('#roomName').val();
    if (roomName.length === 0) {
        return;
    }
    // 位置情報を取得して取得できたらルームを作成
    navigator.geolocation.getCurrentPosition(function(position){
            loc = {"lon": position.coords.longitude, "lat": position.coords.latitude};
            socket.emit('createRoom', { roomName: roomName, location: loc } );
        }, 
        // 位置情報が取得できない場合にはルームの作成は不可。
        function(error){
            alert("位置情報が取得できません。: " + error.code);
        }, 
        {enableHighAccuracy:false, timeout:5000, maximumAge:600000}
    );
    $('#roomName').val("");	
}

/* ===============================================
 * 受信したルーム情報をページに追加する処理
 */
// function updateRoom(data) {
//     var obj = $(document.createElement('div'), {id: "room" + data.roomId});
//     obj.html(data.roomId + ", " + data.roomName + " : " + data.dateTime);
//     $('#roomList').append(obj);
// }

function updateRoomEntity(data) {
    var obj = $("<div>", {id: "room" + data.roomId});
    obj.html(data.roomId + ", " + data.name);
    obj.click(function(){
        socket.emit('subscribe', { roomId: data.roomId ,roomName: data.name } );
    });
    $('#roomList').append(obj);
}
function clearRoom(data) {
    $('#roomList').empty();
}

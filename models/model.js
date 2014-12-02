var debug = require('debug')('nearby-chat-server:model');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var conn = mongoose.connect('mongodb://localhost/chat_db');

autoIncrement.initialize(conn);

// スキーマ定義
var Schema = mongoose.Schema;

// チャットルームを管理するコレクション
var RoomSchema = new Schema({
	roomId: Number,
	name: String,
	location: {lon: Number, lat: Number},
	created_at: { type: Date, default: Date.now }
});
RoomSchema.index({location: '2dsphere'});
RoomSchema.plugin(autoIncrement.plugin, { model: 'Room', field: 'roomId' });
mongoose.model('Room', RoomSchema);
var Room = mongoose.model('Room', RoomSchema);
exports.Room = Room;

// ユーザを管理するスキーマ
var UserSchema = new Schema({
	userName: String,
	token: String,
	token_secret: String,
	location: {lon: Number, lat: Number},
	twitter_id: Number,
	profile_image_url: String,
	twitter: String,
	created_at: { type: Date, default: Date.now }
});
var User = mongoose.model('User', UserSchema);
exports.User = User;

// チャットメッセージを管理するコレクション
var PostMessageSchema = new Schema({
	message_text: String,
	location: {lon: Number, lat: Number},
	like: Number,	// いいね
	infelicity: Number,	// 不適切な発言
	user: { type: Schema.ObjectId, ref: 'User' },
	room: { type: Schema.ObjectId, ref: 'Room' },
	created_at: { type: Date, default: Date.now }
});
var PostMessage = mongoose.model('PostMessage', PostMessageSchema);
exports.PostMessage = PostMessage;

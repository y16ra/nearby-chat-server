nearby-chat-server
==================

node.js + express4 + socket.io を使ったチャット

# Installing Dependencies

- MongoDB: store a chat data.
```
docker run -d -p 27017:27017 --name mongodb dockerfile/mongodb
```

- redis: store a session data.
```
docker run --name redis -d -p 6379:6379 redis redis-server --appendonly yes
```

# How to install

```
npm install
```

twitterのconsumerkey, secretはご自身で取得して、config以下のファイルに記載してください。
間違ってコミットしてしまっていたkey, secretは再取得して無効になっています。

# How to launch

```
npm start
```

# 今後の拡張
少しずつ育てて行く予定。
野望は以下の通り。
- room一覧の体裁をもう少し整える
- 画像送信機能
- 最新の１０件しか表示できないので近いうちにロジックを変更予定。
- インターフェースの仕様を整えてiOSアプリのバックエンドとして利用できるようにする。
- Dockerize

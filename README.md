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

# How to launch

```
npm start
```

# 今後の拡張
少しずつ育てて行く予定。
野望は以下の通り。

- 発言ユーザのアイコン、ニックネームの管理＆表示
- ルームの作成機能
- ルームへのjoin, leave
- MongoDBに発言を保管
- 画像送信機能
- プロジェクト名にあるように近くにいるユーザとのコミュニケーションができる仕組みを導入

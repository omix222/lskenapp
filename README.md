# lskenapp

## WebAPI sample system

## 導入手順 

ローカル端末にSTS(Spring Too Suite)をインストールする。



## サンプルリクエスト、レスポンス 
http://localhost:8080/messages/1

{
"messageId": 1,
"type": "text",
"messageDetail": "hello hello",
"fromUserId": "u001",
"groupId": "g001",
"postDate": 1508364160171
}

H2Databaseアクセス方法
http://localhost:8080/h2-console/login.jsp

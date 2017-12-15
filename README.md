# lskenapp

## WebAPI sample system

## 導入手順 

ローカル端末にSTS(Spring Tool Suite)をインストールする。

・参考手順
https://qiita.com/sk-welldan/items/30d5092247ce6a7da820


STSにEclipseプラグインである、Buildshipをイントールする。
　Eclipse Marketplaceにあります。
　help→Eclipse Marketplace
　「buildship」で検索
　installをクリック。

githubからローカルへのチェックアウト

gitクライアントをインストールしておくこと

### STSへのインポート 
-  パッケージエクスプローラから、右クリック　Import > Gradle > Existing Gradle Project > チェックアウトしたプロジェクトのフォルダ
-  チェックアウトしたらSTSから、プロジェクトを選択、右クリック　＞　Properties > Resources > Text file encodings > Other > UTF-8 を選択

### STSからのアプリケーション起動　

- メニューのWindows　> Show View > Other >Boot Dashbord を選択
- Boot Dashbord を開いたら、local > lskenappをダブルクリックで起動、停止は上部の停止ボタンで止まる
- Cosoleに「Started LskenappApplication in 4.779 seconds (JVM running for 5.57)」といったものが出て入れば起動成功
- ブラウザもしくはcurlで　http://localhost:8080 にアクセス。　hello world!!!　返却されればOK


## CloudFoundary設定、準備

pcfのアカウントは事前に作成しておき、CLIツールを取得、セットアップしておく。

参考　https://blog.ik.am/entries/359

プロジェクトのトップから、　

cf login

cf push lskenapp -p build/libs/lskenapp-0.0.1-SNAPSHOT.jar
 
成功したら、管理コンソール　https://login.run.pivotal.io/　
からログインし、
Pivotal Web Services >
development > Apps > lskenapp を選択　＞　Routeに表示されているURLからアクセス可能。
 



## サンプルリクエスト、レスポンス 

### webAPI 

メッセージ取得(GET)
http://localhost:8080/lskenapp/api/v1.0/messages/1
http request header
 content-type: application/json
 accept: application/json
 authorization: toke

response例
{
"messageId": 1,
"type": "text",
"messageDetail": "hello hello",
"fromUserId": "u001",
"groupId": "g001",
"postDate": 1508364160171
}

メッセージ送信（POST)

送信　

curl -H 'Content-Type:application/json' -H "Accept: application/json" -H "authorization: token" -X POST -d '{"type":"text","messageDetail":"curl posted","fromUserId":"u002","groupId":"g001"}' http://localhost:8080/lskenapp/api/v1.0/messages

⇨messageIdとpostDateはサーバ側で採番、時刻取得するため、クライアントからの送信は不要。

結果　

{"messageId":43,"type":"text","messageDetail":"curl posted","fromUserId":"u002","groupId":"g001","postDate":1508364160171}

### ブラウザ向け　

http://localhost:8080/lskenapp/messagelist

メッセージ一覧が表示されればOK

一旦 SpringMVCで作成しましたが、SPAで作って、APIから読んだ方が研究サンプルシステムにはあっているかもしれません。

検討お願いします。

## H2Databaseコンソールアクセス方法 

http://localhost:8080/lskenapp/h2-console/login.jsp

JDBCのURLのみ変更する。プロジェクトトップからのパスとして、/target/db/testdb　にファイルがあるので、そこを見れるようなパスをする。

例：jdbc:h2:~/oper/gradle/lskenapp/target/db/testdb

GoogleMapAPIのサンプル。htmlをおきました。
/lskenapp/src/main/resources/static/html/staticsample.html
GoogleのAPIキーは伏せ字（XX)にしています。XXを置き換え、
アプリ立ち上げ後、以下にアクセスしてみてください。


http://localhost:8080/lskenapp/html/staticsample.html


認証機能追加しました。
初期データはWebSecurityConfigクラスにべた書きしている通りです。
user / user
admin / admin

それに伴い、restAPIからの認証も追加しています。
messages のエンドポイントのみを対応していますが、Springデフォルトのセキュリティの機構は回避し、
MessageRestController内で
・リクエストヘッダー内にAuthorizationが含まれるか
・POSTの場合、追加でfromUserIdがリクエストBody内に含まれているか
で認証OKか判断しています。


スタンプの画面参照サンプルを追加しました。
http://localhost:8080/lskenapp/stamplist

base64の画面表示例については、stamplistview.html　を参考にしてください。
画像ファイルのbase64化については、別のツール活用が必要です。
仕込みは一旦、LskenappApplication　の中でやっています。
ゆくゆくは、/stampsへのPOSTでやれるクライアントを作れればよいですね。

SpringFoxを使って、Swagger UI生成に対応しました。
http://localhost:8080/lskenapp/swagger-ui.html
で各APIの仕様を確認することができます。要認証。




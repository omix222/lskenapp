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

//TODO : PCF 無料枠で動くようにだけ準備しておく。（乗り換えできるように） 


## サンプルリクエスト、レスポンス 

### webAPI 

メッセージ取得(GET)
http://localhost:8080/messages/1

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

curl -H 'Content-Type:application/json' -H "Accept: application/json" -X POST -d '{"type":"text","messageDetail":"curl posted","fromUserId":"u002","groupId":"g001"}' http://localhost:8080/messages

⇨messageIdとpostDateはサーバ側で採番、時刻取得するため、クライアントからの送信は不要。

結果　

{"messageId":43,"type":"text","messageDetail":"curl posted","fromUserId":"u002","groupId":"g001","postDate":1508364160171}

### ブラウザ向け　

http://localhost:8080/messagelist

メッセージ一覧が表示されればOK

一旦 SpringMVCで作成しましたが、SPAで作って、APIから読んだ方が研究サンプルシステムにはあっているかもしれません。

検討お願いします。

## H2Databaseコンソールアクセス方法 

http://localhost:8080/h2-console/login.jsp

JDBCのURLのみ変更する。プロジェクトトップからのパスとして、/target/db/testdb　にファイルがあるので、そこを見れるようなパスをする。

例：jdbc:h2:~/oper/gradle/lskenapp/target/db/testdb

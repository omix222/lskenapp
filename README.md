# lskenapp

## WebAPI sample system

## 導入手順 

ローカル端末にSTS(Spring Too Suite)をインストールする。

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

JDBCのURLのみ変更する。プロジェクトトップからのパスとして、/target/db/testdb　にファイルがあるので、そこを見れるようなパスをする。

例：jdbc:h2:~/oper/gradle/lskenapp/target/db/testdb

# lskenapp

## WebAPI sample system

## 導入手順 

* ローカル端末にSTS(Spring Tool Suite)をインストールする。

* 参考手順
https://qiita.com/sk-welldan/items/30d5092247ce6a7da820

* STSにEclipseプラグインである、Buildshipをイントールする。
    * Eclipse Marketplaceにあります。
    * help→Eclipse Marketplace
    * 「buildship」で検索
    * installをクリック。

## githubからローカルへのチェックアウト

* gitクライアントをインストールしておくこと

### STSへのインポート 
-  パッケージエクスプローラから、右クリック　Import > Gradle > Existing Gradle Project > チェックアウトしたプロジェクトのフォルダ
-  チェックアウトしたらSTSから、プロジェクトを選択、右クリック　＞　Properties > Resources > Text file encodings > Other > UTF-8 を選択

### STSからのアプリケーション起動　

- メニューのWindows　> Show View > Other >Boot Dashbord を選択
- Boot Dashbord を開いたら、local > lskenappをダブルクリックで起動、停止は上部の停止ボタンで止まる
- Cosoleに「Started LskenappApplication in 4.779 seconds (JVM running for 5.57)」といったものが出て入れば起動成功
- ブラウザもしくはcurlで　http://localhost:8080 にアクセス。　hello world!!!　返却されればOK


## CloudFoundary設定、準備

* pcfのアカウントは事前に作成しておき、CLIツールを取得、セットアップしておく。

* 参考　https://blog.ik.am/entries/359

* プロジェクトのトップから、　
   * 初回は以下実行要  
   * ./gradlew cleanIdea idea
   * ./gradlew build
   * cf login
   * cf push lskenapp -p build/libs/lskenapp-0.0.1-SNAPSHOT.jar
 
* 成功したら、管理コンソール　
* https://login.run.pivotal.io/　
* からログインし、
* Pivotal Web Services >development > Apps > lskenapp を選択　＞　
* Routeに表示されているURLにコンテキストパスの/lskenappを追加したURLからアクセス可能。
   * 例：　　https://lskenapp.cfapps.io/lskenapp/

## サンプルリクエスト、レスポンス 

### webAPI 

* メッセージ取得(GET)
* http://localhost:8080/lskenapp/api/v1.1/messages/1

* response例

{
"messageId": 1,
"type": "text",
"messageDetail": "hello hello",
"fromUserId": "u001",
"groupId": "g001",
"postDate": 1508364160171
}

* 性能強化版

* メッセージ取得(GET)
* http://localhost:8080/lskenapp/api/v1.1/messages/6


* response例

{
  "messageId": 6,
  "type": "stamp",
  "messageDetail": "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",
  "fromUserId": "u001",
  "groupId": "g001",
  "postDate": 1513344998191
}


* メッセージ送信（POST)

* text 送信　

* curl -H 'Content-Type:application/json' -H "Accept: application/json" -H "authorization: token" -X POST -d '{"type":"text","messageDetail":"curl posted","fromUserId":"u002","groupId":"g001"}' http://localhost:8080/lskenapp/api/v1.1/messages

* ⇨messageIdとpostDateはサーバ側で採番、時刻取得するため、クライアントからの送信は不要。

* 結果　

* {"messageId":43,"type":"text","messageDetail":"curl posted","fromUserId":"u002","groupId":"g001","postDate":1508364160171}


* map 情報送信

* curl -H 'Content-Type:application/json' -H "Accept: application/json" -H "authorization: token" -X POST -d '{"type":"map","messageDetail":"35.174744,136.909650","fromUserId":"u002","groupId":"g001"}' http://localhost:8080/lskenapp/api/v1.1/messages


### ブラウザ向け　

* http://localhost:8080/lskenapp/messagelist

* メッセージ一覧が表示されればOK


* 性能強化版のブラウザでの確認画面

* http://localhost:8080/lskenapp/messagelistmerge

* 一旦 SpringMVCで作成しましたが、SPAで作って、APIから読んだ方が研究サンプルシステムにはあっているかもしれません。検討お願いします。

## H2Databaseコンソールアクセス方法 

* http://localhost:8080/lskenapp/h2-console/login.jsp

* JDBCのURLのみ変更する。プロジェクトトップからのパスとして、/target/db/testdb　にファイルがあるので、そこを見れるようなパスをする。

    * 例：jdbc:h2:~/oper/gradle/lskenapp/target/db/testdb

## GoogleMapAPIのサンプル。htmlをおきました。

* /lskenapp/src/main/resources/static/html/staticsample.html
* GoogleのAPIキーは伏せ字（XX)にしています。XXを置き換え、
* アプリ立ち上げ後、以下にアクセスしてみてください。

* http://localhost:8080/lskenapp/html/staticsample.html


## 認証機能追加しました。
* 初期データは以下ユーザーの通りです。パスワードは不要です。
* u001〜u004


* それに伴い、restAPIからの認証も追加しています。
* messages のエンドポイントのみを対応していますが、Springデフォルトのセキュリティの機構は回避し、
* MessageRestController内で
* ・リクエストヘッダー内にAuthorizationが含まれるか
* ・POSTの場合、追加でfromUserIdがリクエストBody内に含まれているか
* で認証OKか判断しています。


## スタンプの画面参照サンプルを追加しました。
* http://localhost:8080/lskenapp/stamplist

* base64の画面表示例については、stamplistview.html　を参考にしてください。
* 画像ファイルのbase64化については、別のツール活用が必要です。
* 仕込みは一旦、LskenappApplication　の中でやっています。
* ゆくゆくは、/stampsへのPOSTでやれるクライアントを作れればよいですね。

## SpringFoxを使って、Swagger UI生成に対応しました。
* http://localhost:8080/lskenapp/swagger-ui.html
* で各APIの仕様を確認することができます。要認証。

* http://localhost:8080/lskenapp/v2/api-docs?group=public
* でswagger yamlも取得可能。

## 確認用のリンク集を作りました。起動後、以下にアクセスしてみてください。
* http://localhost:8080/lskenapp/


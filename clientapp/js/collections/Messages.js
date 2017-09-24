var Backbone = require('backbone');
var Message = require('../models/Message');

module.exports = Backbone.Collection.extend({

    model: Message,
    localStorage: new Backbone.LocalStorage('line_messages'),
    // url: 'http://localhost:8080/messages',    // リソースへのパスを記述。http://〜と書いてもok
    // initialize: function initialize() {    // 追記
    //     this.listenTo(this, 'onFetch', this._onFetch);  // イベント購読
    // },
    // //    parse : function parse(res) {    // modelにsetする値を指定する
    //            return res.list;
    //    }

});

// var messageCollection = new MessageCollection({});
// messageCollection.fetch({
//     success: function success(collection, res, options) {
//         collection.trigger('onFetch');    // 追記：イベント発火
//     },
//     error: function error() {
//         // 通信失敗時の処理
//     }
// });

var Backbone = require('backbone');
var template = require('../../templates/messages/MainTemplate.jst');
var MessageModel = require('../../models/Message');
var MessageCollection = require('../../collections/Messages');
var StampCollection = require('../../collections/Stamps');
var HeaderView = require('./HeaderView');
var MessageListView = require('./MessageListView');
var FooterView = require('./FooterView');

module.exports = Backbone.Marionette.View.extend({
    template: template,
    className: 'full-height',
    ui: {
        messageList: '#message-list-region',
    },
    regions: {
        headerRegion: '#header-region',
        messageListRegion: '#message-list-region',
        footerRegion: '#footer-region',
    },
    initialize: function(options) {
        this.currentUser = options.currentUser;
        this.stamps = new StampCollection();
        this.stamps.fetch();
        this.stamps.setup();
    },
    onRender: function() {
        // APIを使うようになったら第二引数のcollectionは不要。backbone.localstorageの仕様上必要なだけ
      var message = new MessageModel({ groupId: this.model.id, userId: this.currentUser }, { collection: this.collection });
     // var message = new MessageModel({ groupId: this.model.id, userId: this.currentUser });
      this.showChildView('headerRegion', new HeaderView({ model: this.model }));
      this.showChildView('messageListRegion', new MessageListView({ collection: this.collection, currentUser: this.currentUser }));
      this.showChildView('footerRegion', new FooterView({ model: message, collection: this.stamps }));
    },
    onChildviewSaveMessage: function(model) {
        this.collection.add(model);
    },
    onChildviewDomRefresh: function() {
        var scrollHeight = this.getUI('messageList')[0].scrollHeight;
        this.getUI('messageList').scrollTop(scrollHeight);
    },
});


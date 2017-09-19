var Backbone = require('backbone');
var MessageTextView = require('./MessageTextView');
var MessageStampView = require('./MessageStampView');

module.exports = Backbone.Marionette.CollectionView.extend({
    childView: function(model) {
        return model.isStamp() ? MessageStampView : MessageTextView;
    },
    childViewOptions: function(model) {
        return {
            isMyMessage: model.get('username') === this.getOption('currentUser'),
        };
    },
});

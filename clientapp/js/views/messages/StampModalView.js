var Backbone = require('backbone');
var template = require('../../templates/messages/StampModalTemplate.jst');
var StampListView = require('./StampListView');

module.exports = Backbone.Marionette.View.extend({
    id: 'stamp-list-modal',
    className: 'modal',
    template: template,
    regions: {
        stampListRegion: '#stamp-list-region',
    },
    onRender: function() {
        this.showChildView('stampListRegion', new StampListView({ collection: this.collection }));
    },
    onChildviewSelectStamp: function(view) {
        this.$el.modal('hide');
        this.triggerMethod('send:stamp', view.model.get('url'));
    },
});

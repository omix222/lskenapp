var Backbone = require('backbone');
var template = require('../../templates/messages/FooterTemplate.jst');
var FormView = require('./FormView');
var StampModalView = require('./StampModalView');

module.exports = Backbone.Marionette.View.extend({
    template: template,
    regions: {
        formRegion: '#form-region',
        modalRegion: '#stamp-modal-region',
    },
    modelEvents: {
        'sync': 'saved',
    },
    onRender: function() {
        this.showChildView('formRegion', new FormView());
        this.showChildView('modalRegion', new StampModalView({ collection: this.collection }));
    },
    onChildviewSubmitMessage: function(message) {
        this.model.save({ type: 'text', content: message });
    },
    onChildviewSendStamp: function(url) {
        this.model.save({ type: 'stamp', stamp: url });
    },
    saved: function() {
        this.triggerMethod('save:message', this.model.clone());
        this.model.set({ 'id': '', 'content': '', 'type': '', 'stamp': '' }, { unset: true });
        this.render();
    },
});


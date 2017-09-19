var Backbone = require('backbone');
var template = require('../../templates/messages/MessageStampTemplate.jst');

module.exports = Backbone.Marionette.View.extend({
    template: template,
    templateContext: function() {
        return {
            messageClass: this.getOption('isMyMessage') ? 'my-message-stamp' : 'other-message-stamp',
            usernameClass: this.getOption('isMyMessage') ? 'hide' : 'send-username',
        };
    },
});

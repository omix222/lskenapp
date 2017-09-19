var Backbone = require('backbone');
var template = require('../../templates/messages/MessageTextTemplate.jst');

module.exports = Backbone.Marionette.View.extend({
    template: template,
    templateContext: function() {
        return {
            messageClass: this.getOption('isMyMessage') ? 'my-message' : 'other-message',
            usernameClass: this.getOption('isMyMessage') ? 'hide' : 'send-username',
        };
    },
});

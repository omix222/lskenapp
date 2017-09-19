var Backbone = require('backbone');
var template = require('../../templates/messages/FormTemplate.jst');

module.exports = Backbone.Marionette.View.extend({
    template: template,
    ui: {
        inputMessage: '#input-message',
        submit: '#submit',
    },
    triggers: {
        'click @ui.submit': 'submit:form',
    },
    onSubmitForm: function() {
        var message = this.getUI('inputMessage').val().trim();
        if(!message) return;
        this.triggerMethod('submit:message', message);
    },
});


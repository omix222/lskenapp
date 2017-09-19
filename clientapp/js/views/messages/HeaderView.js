var Backbone = require('backbone');
var template = require('../../templates/messages/HeaderTemplate.jst');

module.exports = Backbone.Marionette.View.extend({
    template: template,
    modelEvents: {
        'sync': 'render',
    },
});

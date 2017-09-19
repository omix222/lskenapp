var Backbone = require('backbone');
var template = require('../../templates/messages/StampItemTemplate.jst');

module.exports = Backbone.Marionette.View.extend({
    tagName: 'li',
    template: template,
    triggers: {
        'click': 'select:stamp',
    },
});

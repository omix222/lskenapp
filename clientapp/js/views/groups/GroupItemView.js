var Backbone = require('backbone');
var template = require('../../templates/groups/GroupItemTemplate.jst');

module.exports = Backbone.Marionette.View.extend({
    className: 'group-row',
    template: template,
    triggers: {
        'click': 'click:group',
    },
    onClickGroup: function() {
        Backbone.history.navigate('groups/' + this.model.id + '/messages', { trigger: true });
    },
});

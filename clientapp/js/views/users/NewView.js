var Backbone = require('backbone');
var template = require('../../templates/users/NewTemplate.jst');

module.exports = Backbone.Marionette.View.extend({
    className: 'container',
    template: template,
    ui: {
        username: '#username',
        create: '#create',
    },
    triggers: {
        'click @ui.create': 'click:create',
    },
    modelEvents: {
        sync: 'saved',
    },
    onClickCreate: function() {
        var username = this.getUI('username').val().trim();
        if(!username) return;
        this.model.save({ username: username });
    },
    saved: function(model) {
        // 簡単になりすませるけど今回は手抜きで
        sessionStorage.setItem('line_sample_username', model.get('username'));
        Backbone.history.navigate('groups', { trigger: true });
    },
});


var Backbone = require('backbone');
var template = require('../../templates/sessions/NewTemplate.jst');

module.exports = Backbone.Marionette.View.extend({
    className: 'container',
    template: template,
    ui: {
        username: '#username',
        login: '#login',
    },
    triggers: {
        'click @ui.login': 'click:login',
    },
    modelEvents: {
        sync: 'loginSuccess',
        error: 'loginFail',
    },
    onClickLogin: function() {
        var username = this.getUI('username').val().trim();
        if(!username) return;
        this.model.set({ username: username });
        this.model.fetch();
    },
    loginSuccess: function(model) {
        // 簡単になりすませるけど今回は手抜きで
        sessionStorage.setItem('line_sample_username', model.get('username'));
        Backbone.history.navigate('groups', { trigger: true });
    },
    loginFail: function(model) {
        this.getUI('username').val('');
        alert(model.get('username') + 'は登録されていません。');
    },
});


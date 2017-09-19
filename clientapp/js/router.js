var _ = require('underscore');
var Backbone = require('backbone');
var RootView = require('./views/RootView');
var GroupModel = require('./models/Group');
var MessagesCollection = require('./collections/Messages');
var GroupsCollection = require('./collections/Groups');

var Controller = Backbone.Marionette.Object.extend({
    initialize: function(options) {
        this.rootView = new RootView();
        options.app.showView(this.rootView);
        // 初期データ投入
        // backbone.localstorageを使っているからthisに紐付けてる
        this.groupCollection = new GroupsCollection();
        this.groupCollection.fetch();
        this.groupCollection.setup();
    },
    newSession: function() {
        this.rootView.showNewSession();
    },
    newUser: function() {
        this.rootView.showNewUser();
    },
    messages: function(id) {
        var username = this.getUsername();
        var group = new GroupModel({ id: id });
        var messages = new MessagesCollection();
        this.rootView.showMessages(username, group, messages);
        group.fetch();
        messages.fetch().done(function() {
            // APIを使ってないので手動で絞込み
            messages.reset(messages.where({ groupId: id }));
        });
    },
    groups: function() {
        var username = this.getUsername();
        this.rootView.showGroups(username, this.groupCollection);
        this.groupCollection.fetch();
    },
    getUsername: function() {
        return sessionStorage.getItem('line_sample_username');
    },
});

module.exports = Backbone.Marionette.AppRouter.extend({
    initialize: function(options) {
        this.controller = new Controller(options);
    },
    onRoute: function(route) {
        if(!this.isAccessible(route)) this.navigate('sessions/new', { trigger: true });
    },
    appRoutes: {
        '': 'groups',
        'sessions/new': 'newSession',
        'users/new': 'newUser',
        'groups': 'groups',
        'groups/:id/messages': 'messages',
    },
    isAccessible: function(route) {
        var accessibleNoLogin = ['newSession', 'newUser'];
        return _.contains(accessibleNoLogin, route) || sessionStorage['line_sample_username'];
    },
});

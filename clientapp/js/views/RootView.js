var Backbone = require('backbone');
var template = require('../templates/RootTemplate.jst');
var UserModel = require('../models/User');
var NewSessionView = require('./sessions/NewView');
var NewUserView = require('./users/NewView');
var MessagesMainView = require('./messages/MainView');
var GroupsMainView = require('./groups/MainView');

module.exports = Backbone.Marionette.View.extend({
    template: template,
    className: 'full-height',
    regions: {
        mainRegion: '#main-region',
    },
    showNewSession: function() {
        this.showChildView('mainRegion', new NewSessionView({ model: new UserModel() }));
    },
    showNewUser: function() {
        this.showChildView('mainRegion', new NewUserView({ model: new UserModel() }));
    },
    showMessages: function(username, group, messages) {
        this.showChildView('mainRegion', new MessagesMainView({ model: group, collection: messages, currentUser: username }));
    },
    showGroups: function(username, groups) {
        this.showChildView('mainRegion', new GroupsMainView({ collection: groups, currentUser: username }));
    },
});


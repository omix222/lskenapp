var Backbone = require('backbone');
var template = require('../../templates/groups/MainTemplate.jst');
var HeaderView = require('./HeaderView');
var GroupListView = require('./GroupListView');

module.exports = Backbone.Marionette.View.extend({
    template: template,
    className: 'full-height',
    regions: {
        headerRegion: '#header-region',
        groupListRegion: '#group-list-region',
    },
    onRender: function() {
        this.showChildView('headerRegion', new HeaderView());
        this.showChildView('groupListRegion', new GroupListView({ collection: this.collection }));
    },
});


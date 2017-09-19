var Backbone = require('backbone');
var GroupItemView = require('./GroupItemView');

module.exports = Backbone.Marionette.CollectionView.extend({
    childView: GroupItemView,
});

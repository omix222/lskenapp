var Backbone = require('backbone');
var StampItemView = require('./StampItemView');

module.exports = Backbone.Marionette.CollectionView.extend({
    tagName: 'ul',
    className: 'list-inline',
    childView: StampItemView,
    childViewTriggers: {
        'select:stamp': 'select:stamp',
    },
});

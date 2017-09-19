var _ = require('underscore');
var Backbone = require('backbone');
var Stamp = require('../models/Stamp');

module.exports = Backbone.Collection.extend({
    model: Stamp,
    localStorage: new Backbone.LocalStorage('line_stamps'),
    setup: function() {
        if(localStorage['line_stamps']) return;
        var stamps = [
            { url: 'images/stamps/1.png' },
            { url: 'images/stamps/2.png' },
            { url: 'images/stamps/3.png' },
            { url: 'images/stamps/4.png' },
            { url: 'images/stamps/5.png' }
        ];
        _.each(stamps, function(stamp) { this.create(stamp); }, this);
    },
});

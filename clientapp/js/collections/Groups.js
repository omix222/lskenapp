var _ = require('underscore');
var Backbone = require('backbone');
var Group = require('../models/Group');

module.exports = Backbone.Collection.extend({
    model: Group,
    localStorage: new Backbone.LocalStorage('line_groups'),
    setup: function() {
        if(localStorage['line_groups']) return;
        var groups = [
            { name: 'グループ1' },
            { name: 'グループ2' },
            { name: 'グループ3' },
            { name: 'グループ4' },
            { name: 'グループ5' },
            { name: 'グループ6' },
            { name: 'グループ7' },
            { name: 'グループ8' },
            { name: 'グループ9' }
        ];
        _.each(groups, function(group) { this.create(group); }, this);
    },
});

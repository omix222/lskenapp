var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
    defaults: {
        content: '',
        type: '',
        username: '',
        groupId: '',
        stamp: '',
    },
    isText: function() {
        return this.get('type') === 'text';
    },
    isStamp: function() {
        return this.get('type') === 'stamp';
    },
});

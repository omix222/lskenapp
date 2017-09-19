var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
    defaults: {
        name: '',
        icon: 'images/mebn.png',
    },
    localStorage: new Backbone.LocalStorage('line_groups'),
});

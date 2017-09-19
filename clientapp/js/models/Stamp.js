var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
    defaults: {
        url: '',
    },
    localStorage: new Backbone.LocalStorage('line_stamps'),
});

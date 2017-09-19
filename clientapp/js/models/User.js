var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
    idAttribute: 'username',
    localStorage: new Backbone.LocalStorage('line_users'),
});

require('jquery');
require('bootstrap');
require('backbone.marionette');
require('backbone.localstorage');
var Backbone = require('backbone');
var Router = require('./router');

var App = Backbone.Marionette.Application.extend({
    region: '#root-region',
    onStart: function() {
        new Router({ app: this });
        Backbone.history.start();
    },
});

var app = new App();
app.start();

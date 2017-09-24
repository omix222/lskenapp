var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
    defaults: {
     //   messageDetail: '',
     content:'',  
     type: '',
        //fromUserId: '',
        username:'',
        groupId: '',
        stamp: '',
        postDate:'',
    },
    isText: function() {
        return this.get('type') === 'text';
    },
    isStamp: function() {
        return this.get('type') === 'stamp';
    },
});

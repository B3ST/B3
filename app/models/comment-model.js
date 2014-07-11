define([
  'jquery',
  'backbone',
  'models/user-model',
  'models/settings-model'
], function ($, Backbone, User, Settings) {
  var Comment = Backbone.Model.extend({
    defaults: {
      ID       : null,
      post     : null,
      content  : '',
      type     : '',
      parent   : 0,
      date     : new Date(),
      date_gmt : new Date(),
      author   : new User(),
      meta     : {},
      status   : 'hold'
    },

    url: function () {
      var cid = (this.get('ID') || ''),
          pid = (this.get('post') || '');
      return Settings.get('url') + '/posts/' + pid + '/comments/' + cid;
    }
  });

  return Comment;
});
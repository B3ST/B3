/* global define */

define([
  'backbone',
  'models/base-model',
  'models/user-model',
  'models/settings-model'
], function (Backbone, BaseModel, User, Settings) {
  'use strict';

  var Comment = BaseModel.extend({
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
      var cid = (this.get('ID') || '');
      var pid = (this.get('post') || '');
      return Settings.get('api_url') + '/posts/' + pid + '/b3:replies/' + cid;
    }
  });

  return Comment;
});

define([
  'jquery',
  'backbone',
  'models/settings-model'
], function ($, Backbone, Settings) {
  'use strict';
  var User = Backbone.Model.extend({
    defaults: {
      ID         : null,
      username   : '',
      email      : '',
      password   : '',
      name       : '',
      first_name : '',
      last_name  : '',
      nickname   : '',
      slug       : '',
      URL        : '',
      avatar     : ''
    },

    idAttribute: 'ID',
    urlRoot: Settings.get('apiUrl') + '/users',
  });

  return User;
});

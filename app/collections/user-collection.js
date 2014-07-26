define([
  'jquery',
  'backbone',
  'models/user-model',
  'models/settings-model'
], function ($, Backbone, User, Settings) {
  'use strict';
  var Users = Backbone.Collection.extend({
    model: User,
    url: Settings.get('apiUrl') + '/users'
  });

  return Users;
});

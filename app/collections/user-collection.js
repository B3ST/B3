define([
  'jquery',
  'backbone',
  'models/user-model',
  'models/settings-model'
], function ($, Backbone, User, Settings) {
  var Users = Backbone.Collection.extend({
    model: User,
    url: Settings.get('url') + '/users'
  });

  return Users;
});
define([
  'jquery',
  'backbone',
  'models/user-model'
], function ($, Backbone, User) {
  var Users = Backbone.Collection.extend({
    model: User
  });

  return Users;
});
define([
  'jquery',
  'backbone'
], function ($, Backbone) {
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
    urlRoot: '/users',
  });

  return User;
});
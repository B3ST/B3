/* global define */

define([
  'jquery',
  'underscore',
  'backbone',
  'models/settings-model'
], function ($, _, Backbone, Settings) {
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

    urlRoot: Settings.get('api_url') + '/users',

    isLoggedIn: function () {
      return !isNaN(this.get('ID')) && !_.isEmpty(this.get('name'));
    }
  });

  return User;
});

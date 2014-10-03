/* global define */

define([
  'underscore',
  'backbone',
  'models/user-model',
], function (_, Backbone, User) {
  'use strict';

  var BaseModel = Backbone.Model.extend({
    parseableDates: ['date', 'modified', 'date_gmt', 'modified_gmt'],

    toJSON: function () {
      var attributes = _.clone(this.attributes);

      _.each(this.parseableDates, function(key) {
        if (key in attributes) {
          attributes[key] = attributes[key].toISOString();
        }
      });

      if (this.get('author')) {
        attributes.author = this.get('author').attributes;
      }

      if (_.isObject(this.get('post'))) {
        attributes.post = this.get('post').toJSON();
      }

      return attributes;
    },

    parse: function(response) {
      _.each(this.parseableDates, function(key) {
        if (response.hasOwnProperty(key)) {
          var timestamp = Date.parse(response[key]);
          response[key] = new Date(timestamp);
        }
      });

      if (response.author) {
        response.author = new User(response.author);
      }

      return response;
    }
  });

  return BaseModel;
});
/* global define */

define([
  'jquery',
  'backbone',
  'models/post-model',
  'models/settings-model'
], function ($, Backbone, Post, Settings) {
  'use strict';

  var Posts = Backbone.Collection.extend({
    model: Post,
    url: function () {
      return Settings.get('api_url') + '/posts?' + this.filter.serialize();
    },

    initialize: function (filter) {
      this.filter = filter;
    },
  });

  return Posts;
});

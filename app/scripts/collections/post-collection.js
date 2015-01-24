/* global define */

define([
  'collections/base-collection',
  'models/post-model',
  'models/settings-model'
], function (BaseCollection, Post, Settings) {
  'use strict';

  var Posts = BaseCollection.extend({
    model: Post,
    heartbeat: 'heartbeat:posts',

    url: function () {
      return Settings.get('api_url') + '/posts?' + this.filter.serialize();
    },

    initialize: function (models, options) {
      options     = options || {};
      this.filter = options.filter;
    },
  });

  return Posts;
});

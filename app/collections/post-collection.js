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
    url: Settings.get('api_url') + '/posts'
  });

  return Posts;
});

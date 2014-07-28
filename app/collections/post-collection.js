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
    url: Settings.get('apiUrl') + '/posts'
  });

  return Posts;
});

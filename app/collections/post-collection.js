define([
  'jquery',
  'backbone',
  'models/post-model',
  'models/settings-model'
], function ($, Backbone, Post, Settings) {
  var Posts = Backbone.Collection.extend({
    model: Post,
    url: Settings.get('url') + '/posts'
  });

  return Posts;
});
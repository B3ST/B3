define([
  'jquery',
  'backbone',
  'models/post-model'
], function ($, Backbone, Post) {
  var Posts = Backbone.Collection.extend({
    model: Posts
  });

  return Posts;
});
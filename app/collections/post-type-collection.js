define([
  'jquery',
  'backbone',
  'models/post-type-model'
], function ($, Backbone, PostType) {
  var PostTypes = Backbone.Collection.extend({
    model: PostType
  });

  return PostTypes;
});
define([
  'jquery',
  'backbone',
  'models/comment-model'
], function ($, Backbone, Comment) {
  var Comments = Backbone.Collection.extend({
    model: Comment
  });

  return Comments;
});
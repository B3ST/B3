define([
  'jquery',
  'backbone',
  'models/comment-model'
], function ($, Backbone, Comment) {
  var Comments = Backbone.Collection.extend({
    model:      Comment,
    comparator: function (comment) {
      return [comment.get('parent'), comment.get('ID')];
    }
  });

  return Comments;
});
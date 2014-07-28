/* global define */

define([
  'jquery',
  'backbone',
  'models/comment-model'
], function ($, Backbone, Comment) {
  'use strict';
  var Comments = Backbone.Collection.extend({
    model:      Comment,
    comparator: function (comment) {
      return [comment.get('parent'), comment.get('ID')];
    }
  });

  return Comments;
});

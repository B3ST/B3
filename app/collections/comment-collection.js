/* global define */

define([
  'jquery',
  'backbone',
  'models/comment-model'
], function ($, Backbone, Comment) {
  'use strict';
  var Comments = Backbone.Collection.extend({
    model: Comment,
    url: function () {
      return this.uri;
    },

    initialize: function (options) {
      options = options || {};
      this.uri = options.uri || '';
    },

    comparator: function (comment) {
      return comment.get('ID');
    }
  });

  return Comments;
});

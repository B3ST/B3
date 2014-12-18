/* global define */

define([
  'collections/base-collection',
  'models/comment-model'
], function (BaseCollection, Comment) {
  'use strict';

  var Comments = BaseCollection.extend({
    model:     Comment,
    heartbeat: 'heartbeat:comments',

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

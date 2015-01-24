/* global define */

define([
  'underscore',
  'backbone',
  'marionette',
  'behaviors/reply-behavior',
  'behaviors/navigation-behavior',
  'templates/content/comments/comment-template'
], function (_, Backbone) {
  'use strict';

  var CommentView = Backbone.Marionette.CompositeView.extend({
    template: 'content/comments/comment-template.dust',

    ui: {
      authorLink:  '.comment-author',
      replyButton: 'a.reply'
    },

    behaviors: {
      Navigation: {},
      Reply: {}
    },

    tagName:  function () {
      return 'li id="comment-' + this.model.get('ID') + '" class="media comment"';
    },

    initialize: function () {
      this.post = null;
    },

    setPost: function (post) {
      this.post = post;
      this.render();
    },

    getPost: function () {
      return this.post;
    },

    serializeData: function () {
      return this.post ? _.extend({}, this.model.toJSON(), { post: this.post.toJSON(), isPostAuthor: this._isByPostAuthor() })
                       : _.extend({}, this.model.toJSON(), { isPostAuthor: false });
    },

    parentId: function () {
      return this.model.get('ID');
    },

    _isByPostAuthor: function () {
      return this.post.get('author').get('ID') === this.model.get('author').get('ID');
    }
  });

  return CommentView;
});

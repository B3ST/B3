/* global define */

define([
  'jquery',
  'underscore',
  'views/replyable-view',
  'buses/navigator',
  'templates/content/comments/comment-template'
], function ($, _, ReplyableView, Navigator) {
  'use strict';

  var CommentView = ReplyableView.extend({
    template: 'content/comments/comment-template.dust',
    events: _.extend({}, ReplyableView.prototype.events, {
      'click .comment-author': 'displayAuthor'
    }),

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
      return this.post ? _.extend({}, this.model.toJSON(), { post: this.post.toJSON() })
                       : this.model.toJSON();
    },

    parentId: function () {
      return this.model.get('ID');
    },

    displayAuthor: function (event) {
      var slug = $(event.currentTarget).attr('slug');
      Navigator.navigateToAuthor(slug, null, true);
      event.preventDefault();
    }
  });

  return CommentView;
});

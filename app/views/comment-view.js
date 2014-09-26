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

    displayAuthor: function (ev) {
      var slug = $(ev.currentTarget).attr('slug'),
          page = 1, trigger = true;

      if (slug) {
        Navigator.navigateToAuthor(slug, page, trigger);
      }
      ev.preventDefault();
    }
  });

  return CommentView;
});

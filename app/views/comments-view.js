/* global define */

define([
  'views/replyable-view',
  'views/comment-view',
  'templates/content/comments/comments-section-template'
], function (ReplyableView, CommentView) {
  'use strict';

  var CommentsView = ReplyableView.extend({
    template:       'content/comments/comments-section-template.dust',
    childView:      CommentView,
    childContainer: '.comments',

    collectionEvents: {
      'sort':  'scroll',
      'reset': 'render'
    },

    attachHtml: function (collectionView, itemView) {
      itemView.setPost(this.model);

      if (itemView.model.get('parent') > 0) {
        collectionView.$('#comment-' + itemView.model.get('parent') + ' > .comment-body > ul.comments').append(itemView.el);
      } else {
        var commentSection = collectionView.$('.comments');
        $(commentSection[0]).append(itemView.el);
      }
    },

    scroll: function (comments) {
      this.render();
      this._scrollToReply(comments.last().get('ID'));
    },

    _scrollToReply: function (id) {
      var placeholder = "#comment-" + id,
          offset      = $(placeholder).offset();
      if (offset) {
        $('html,body').animate({
          scrollTop: offset.top - 100
        }, 'slow');
        $(placeholder).effect('highlight', {}, 1500);
      }
    }
  });

  return CommentsView;
});
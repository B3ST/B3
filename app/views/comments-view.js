/* global define */

define([
  'underscore',
  'backbone',
  'marionette',
  'views/comment-view',
  'behaviors/reply-behavior',
  'behaviors/heartbeat-behavior',
  'templates/content/comments/comments-section-template'
], function (_, Backbone, Marionette, CommentView) {
  'use strict';

  var CommentsView = Backbone.Marionette.CompositeView.extend({
    template:       'content/comments/comments-section-template.dust',
    tagName:        'div id="comments-container"',
    childView:      CommentView,
    childContainer: '.comments',

    collectionEvents: {
      'sort':  'scroll',
      'reset': 'render'
    },

    ui: {
      replyButton: 'a.reply'
    },

    behaviors: {
      Heartbeat: {},
      Reply: {}
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
      this.scrollToReply(comments.last().get('ID'));
    },

    scrollToReply: function (id) {
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

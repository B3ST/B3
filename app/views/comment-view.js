'use strict';

define([
  'jquery',
  'marionette',
  'dust',
  'dust.helpers',
  'dust.marionette',
  'views/replyable-view',
  'content/comments/comment-template'
], function ($, Marionette, dust, dustHelpers, dustMarionette, ReplyableView) {
  var view = _.extend(ReplyableView, {
    template: 'content/comments/comment-template.dust',
    tagName:  function () {
      return 'li id="comment-' + this.model.get('ID') + '"';
    },

    initialize: function (options) {
      this.post = null;
      this.user = null;
    },

    events: {
      'click a.b3-reply-comment': 'renderReplyBox',
    },

    parentId: function () {
      return this.model.get('ID');
    }
  });

  var CommentView = Backbone.Marionette.ItemView.extend(view);
  return CommentView;
});
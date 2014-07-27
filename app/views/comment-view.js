/* global define */

define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'dust',
  'dust.helpers',
  'dust.marionette',
  'views/replyable-view',
  'content/comments/comment-template'
], function ($, _, Backbone, Marionette, dust, dustHelpers, dustMarionette, ReplyableView) {
  'use strict';

  var view = _.extend(ReplyableView, {
    template: 'content/comments/comment-template.dust',
    
    tagName:  function () {
      return 'li id="comment-' + this.model.get('ID') + '" class="media comment"';
    },

    initialize: function () {
      this.post = null;
      this.user = null;
    },

    events: {
      'click .b3-reply-comment': 'renderReplyBox',
    },

    parentId: function () {
      return this.model.get('ID');
    }
  });

  var CommentView = Backbone.Marionette.ItemView.extend(view);
  return CommentView;
});

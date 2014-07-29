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
  'controllers/navigator',
  'content/comments/comment-template'
], function ($, _, Backbone, Marionette, dust, dustHelpers, dustMarionette, ReplyableView, Navigator) {
  'use strict';

  var view = _.extend(ReplyableView, {
    template: 'content/comments/comment-template.dust',

    tagName:  function () {
      return 'li id="comment-' + this.model.get('ID') + '" class="media comment"';
    },

    events: {
      'click .b3-reply-comment':  'renderReplyBox', // from ReplyableView
      'click .b3-comment-author': 'displayAuthor'
    },

    initialize: function () {
      this.post = null;
      this.user = null;
    },

    serializeData: function () {
      return this.model.toJSON();
    },

    parentId: function () {
      return this.model.get('ID');
    },

    displayAuthor: function (event) {
      var slug = $(event.currentTarget).attr('slug');
      Navigator.navigate('post/author/' + slug, true);
      event.preventDefault();
    }
  });

  var CommentView = Backbone.Marionette.ItemView.extend(view);
  return CommentView;
});

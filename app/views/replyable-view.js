/* global define */

define([
  'jquery',
  'views/reply-form-view'
], function ($, ReplyFormView) {
  'use strict';

  var ReplyableView = {
    renderReplyBox: function (event) {
      event.preventDefault();

      this.clickedReplyButton = $(event.currentTarget);

      if (!this.replyBoxRendered) {
        this.renderIt();
      }
    },

    renderIt: function () {
      /**
       * TODO:
       * - Rename "model" to "post"
       * - model should be either:
       *   - A new Comment model
       *   - A saved Comment model (see https://trello.com/c/MliJUQ6n)
       */
      this.replyBox = new ReplyFormView({
        model:      this.post,
        user:       this.user,
        parentView: this,
        parentId:   this.parentId()
      });

      this.replyBox.render();

      $(this.clickedReplyButton).after(this.replyBox.el);
      $(this.clickedReplyButton).hide();
      this.replyBoxRendered = true;
    },

    parentId: function () {
      return 0;
    },

    replyRendered: function () {

    },

    replyDestroyed: function () {
      $(this.clickedReplyButton).show();
      $(this.replyBox.el).remove();
      this.replyBoxRendered = false;
      this.replyBox = null;
    },
  };

  return ReplyableView;
});

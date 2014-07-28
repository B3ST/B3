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

      if (!this.$(this.replyForm).length) {
        this.renderReplyForm();
      }

      return false;
    },

    renderReplyForm: function () {
      /**
       * TODO:
       * - Rename "model" to "post"
       * - model should be either:
       *   - A new, empty Comment model
       *   - A locally stored Comment model (see https://trello.com/c/MliJUQ6n)
       */
      this.replyForm = new ReplyFormView({
        model:      this.post,
        user:       this.user,
        parentView: this,
        parentId:   this.parentId()
      });

      this.replyForm.render();
      $(this.clickedReplyButton).after(this.replyForm.el);
    },

    parentId: function () {
      return 0;
    },

    replyFormRendered: function () {
      var that = this;
      $(this.clickedReplyButton).fadeOut('fast', function () {
        $(that.replyForm.el).slideDown('slow');
      });
    },

    replyFormDestroyed: function () {
      $(this.clickedReplyButton).fadeIn('fast');
      $(this.replyForm.el).remove();
      this.replyForm = null;
    },
  };

  return ReplyableView;
});

/* global define */

define([
  'jquery',
  'views/reply-form-view'
], function ($, ReplyFormView) {
  'use strict';

  var ReplyableView = {
    renderReplyBox: function (event) {
      event.preventDefault();
      event.stopPropagation();
      this.clickedReplyButton = $(event.currentTarget);

      if (!this.$(this.replyForm).length) {
        this.renderReplyForm();
      }
    },

    renderReplyForm: function () {
      if (!this.previouslyRendered) {
        this.renderNewForm();
      } else {
        this.replyFormRendered();
      }
    },

    renderNewForm: function () {
      this.replyForm = new ReplyFormView({
        post:       this.post,
        user:       this.user,
        parentView: this,
        parentId:   this.parentId()
      });

      this.replyForm.render();
      $(this.clickedReplyButton).after(this.replyForm.el);
      this.previouslyRendered = true;
    },

    parentId: function () {
      return 0;
    },

    replyFormCancelled: function () {
      $(this.clickedReplyButton).fadeIn('fast');
    },

    replyFormRendered: function () {
      $(this.clickedReplyButton).fadeOut('fast', function () {
        $(this.replyForm.el).slideDown('slow');
      }.bind(this));
    },

    replyFormDestroyed: function () {
      $(this.clickedReplyButton).fadeIn('fast');
      $(this.replyForm.el).remove();
      this.replyForm = null;
    },
  };

  return ReplyableView;
});

/* global define */

define([
  'jquery',
  'views/reply-form-view'
], function ($, ReplyFormView) {
  'use strict';

  var ReplyableView = {
    renderReplyBox: function (event) {
      event.preventDefault();

      if (!this.replyBoxRendered) {
        this.renderIt(event);
      }
      return false;
    },

    renderIt: function (ev) {
      var placeholder = $(ev.currentTarget).siblings('.b3-reply-section');
      this.replyBox = new ReplyFormView({model: this.post, user: this.user, parentView: this, parentId: this.parentId()});
      this.replyBox.render();
      this.$(placeholder).html(this.replyBox.el);
    },

    parentId: function () {
      return 0;
    },

    replyRendered: function () {
      this.replyBoxRendered = true;
    },

    replyDestroyed: function () {
      this.replyBox = null;
      this.replyBoxRendered = false;
    },
  };

  return ReplyableView;
});

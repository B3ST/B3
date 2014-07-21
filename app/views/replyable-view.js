'use strict';

define([
  'jquery',
  'views/reply-form-view'
], function ($, ReplyFormView) {
  var ReplyableView = {
    renderReplyBox: function (ev) {
      if (!this.replyBoxRendered) {
        this.renderIt(ev);
      }
      return false;
    },

    renderIt: function (ev) {
      var placeholder = $(ev.currentTarget).siblings();
      this.replyBox = new ReplyFormView({model: this.post, parentView: this, parentId: this.parentId()});
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
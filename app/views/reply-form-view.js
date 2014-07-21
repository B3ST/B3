'use strict';

define([
  'jquery',
  'marionette',
  'dust',
  'dust.marionette',
  'controllers/event-bus',
  'models/comment-model',
  'forms/replyform-template'
], function ($, Marionette, dust, dustMarionette, EventBus, Comment) {
  var ReplyFormView = Backbone.Marionette.ItemView.extend({
    template: "forms/replyform-template.dust",
    tagName:  "div id='b3-replyform'",
    events: {
      'click #b3-cancel':      'cancelReply',
      'click #b3-replybutton': 'sendReply'
    },

    initialize: function (options) {
      this.parentView = options.parentView;
    },

    onRender: function () {
      this.parentView.replyRendered();
    },

    onDestroy: function () {
      this.parentView.replyDestroyed();
    },

    sendReply: function () {
      this.getComment().save();
      this.destroy();
    },

    cancelReply: function () {
      this.destroy();
    },

    getComment: function () {
      return new Comment({
        content: this.$('#b3-replybox').val(),
        post:    this.model.get('ID'),
        parent:  this.model.get('ID')
      });
    }
  });

  return ReplyFormView;
});
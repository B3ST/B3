/* global define */

define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'buses/event-bus',
  'models/user-model',
  'behaviors/reply-behavior',
  'templates/forms/replyform-template'
], function ($, _, Backbone, Marionette, EventBus, User) {
  'use strict';

  var ReplyFormView = Backbone.Marionette.ItemView.extend({
    template: 'forms/replyform-template.dust',
    events: {
      'click .cancel': 'onCancelClicked'
    },

    ui: {
      submitButton: '#replyactions > .reply',
      replyForm:    '#replyform form'
    },

    behaviors: {
      Reply: {}
    },

    tagName: function () {
      return 'div class="replyform"';
    },

    initialize: function (options) {
      this.user     = options.user;
      this.parentId = options.parentId;
      this.post     = options.post;
    },

    serializeData: function () {
      return {
        author:  this.user.attributes,
        guest:   !this.user.isLoggedIn(),
        post:    this.post.attributes,
        comment: ''
      };
    },

    onShow: function () {
      this.$el.hide().slideDown('slow');
      $(this.clickedReplyButton).fadeIn('fast');
    },

    onCancelClicked: function (ev) {
      this.$el.slideUp('slow', function() {
        EventBus.trigger('replyform:view:cancel');
        this.destroy();
      }.bind(this));
      ev.preventDefault();
    },

    displayWarning: function (message) {
      this.$('#warning').addClass('alert alert-danger').text(message);

      if (_.isEmpty(message)) {
        this.resetWarning();
      }
    },

    resetWarning: function () {
      this.$('#warning').removeClass('alert alert-danger').text('');
    },

    // For Reply behavior
    getUser: function () {
      if (this.user.isLoggedIn()) {
        return this.user;
      }

      return new User({
        name:  this.$('[name="author_name"]').val(),
        email: this.$('[name="author_email"]').val(),
        URL:   this.$('[name="author_url"]').val()
      });
    }
  });

  return ReplyFormView;
});

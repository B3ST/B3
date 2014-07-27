/* global define */

define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'dust',
  'dust.marionette',
  'controllers/event-bus',
  'models/comment-model',
  'models/user-model',
  'forms/replyform-template'
], function ($, _, Backbone, Marionette, dust, dustMarionette, EventBus, Comment, User) {
  'use strict';

  var ReplyFormView = Backbone.Marionette.ItemView.extend({
    template: "forms/replyform-template.dust",
    tagName:  "div id='b3-replyform'",
    events: {
      'click #b3-cancel':      'cancelReply',
      'click #b3-replybutton': 'sendReply'
    },

    initialize: function (options) {
      this.user       = options.user;
      this.parentView = options.parentView;
      this.parentId   = options.parentId;
      this.model      = options.model;
    },

    serializeData: function () {
      return {
        name:           this.user.get('name'),
        email:          this.user.get('email'),
        URL:            this.user.get('url'),
        guest:          !this.user.isLoggedIn(),
        comment_status: this.model.get('comment_status')
      };
    },

    onRender: function () {
      this.parentView.replyRendered();
      this.mandatory = ['#b3-replybox'];
      if (!this.user.isLoggedIn()) {
        this.mandatory = this.mandatory.concat(['#b3-author-name', '#b3-author-email']);
      }
    },

    onDestroy: function () {
      this.parentView.replyDestroyed();
    },

    sendReply: function (event) {
      var fields = this.getFields();
      if (fields.isFilled) {
        this.getComment().save().done(function (response) {
          EventBus.trigger('comment:create', new Comment(response));
        });
        this.destroy();
      } else {
        this.displayWarning(fields.unfilled);
        event.preventDefault();
      }
    },

    cancelReply: function (ev) {
      ev.preventDefault();
      this.destroy();
    },

    getFields: function () {
      var filled   = true;
      var unfilled = [];

      this.mandatory.forEach(function (field) {
        var hasText = !_.isEmpty(this.$(field).val());
        if (!hasText) {
          unfilled.push(field);
        }
        filled = (filled && hasText);
      }.bind(this));

      return {isFilled: filled, unfilled: unfilled};
    },

    getComment: function () {
      return new Comment({
        content:        this.$('#b3-replybox').val(),
        post:           this.model.get('ID'),
        parent_comment: this.parentId,
        author:         this.getUser()
      });
    },

    getUser: function () {
      if (this.user.isLoggedIn()) {
        return this.user;
      }

      return new User({
        name:  this.$('#b3-author-name').val(),
        email: this.$('#b3-author-email').val(),
        URL:   this.$('#b3-author-url').val()
      });
    },

    displayWarning: function (unfilled) {
      $('#b3-warning')
        .addClass('alert alert-danger')
        .text('Please fill all required fields.');

      unfilled.forEach(function (field) {
        $(field + '-group').addClass('has-error');
      }.bind(this));
    }
  });

  return ReplyFormView;
});

'use strict';

define([
  'jquery',
  'marionette',
  'dust',
  'dust.marionette',
  'controllers/event-bus',
  'models/comment-model',
  'models/user-model',
  'forms/replyform-template'
], function ($, Marionette, dust, dustMarionette, EventBus, Comment, User) {
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
    },

    serializeData: function () {
      return (this.userIsLogged() ? {display: "false"} : {display: "true"});
    },

    onRender: function () {
      this.parentView.replyRendered();
      this.mandatory = ['#b3-replybox'];
      if (!this.userIsLogged()) {
        this.mandatory = this.mandatory.concat(['#b3-author-name', '#b3-author-email']);
      }
    },

    onDestroy: function () {
      this.parentView.replyDestroyed();
    },

    sendReply: function () {
      var fields = this.getFields();
      if (fields.isFilled) {
        this.getComment().save();
        this.destroy();
      } else {
        this.displayWarning(fields.unfilled);
      }
    },

    cancelReply: function () {
      this.destroy();
    },

    getFields: function () {
      var filled = true, unfilled = [];
      this.mandatory.forEach(function (field) {
        var hasText = (this.$(field).val() != '');
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
      if (this.userIsLogged()) {
        return this.user;
      }

      return new User({name: this.$('#b3-author-name').val(), email: this.$('#b3-author-email').val()});
    },

    userIsLogged: function () {
      return this.user.get('name') != '' && this.user.get('email') != '';
    },

    displayWarning: function (unfilled) {
      this.$('#b3-warning').text('Please fill mandatory fields');
      unfilled.forEach(function (field) {
        this.$(field + '-label').removeClass('red');
        this.$(field + '-label').addClass('red');
      }.bind(this));
    }
  });

  return ReplyFormView;
});
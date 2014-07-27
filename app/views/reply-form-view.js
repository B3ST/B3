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
  'models/post-model',
  'forms/replyform-template'
], function ($, _, Backbone, Marionette, dust, dustMarionette, EventBus, Comment, User, Post) {
  'use strict';

  var ReplyFormView = Backbone.Marionette.ItemView.extend({
    template: "forms/replyform-template.dust",
    tagName:  'div id="b3-replyform"',
    events: {
      'click #b3-cancel':          'cancelReply',
      'click #b3-replybutton':     'sendReply',
      'submit #b3-replyform form': 'sendReply'
    },

    initialize: function (options) {
      this.user       = options.user;
      this.parentView = options.parentView;
      this.parentId   = options.parentId;
      this.model      = options.model || new Post();
    },

    serializeData: function () {
      return {
        author:  this.user.attributes,
        guest:   !this.user.isLoggedIn(),
        post:    this.model.attributes,
        comment: ''
      };
    },

    onRender: function () {
      $(this.el).hide();
      this.parentView.replyFormRendered();
    },

    onDestroy: function () {
      this.parentView.replyFormDestroyed();
    },

    sendReply: function (event) {
      var that  = this;
      
      event.preventDefault();

      if (this.validateForm()) {
        this.getComment().save()
          .done(function (response) {
            that.slideUpAndDestroy();
            EventBus.trigger('comment:create', new Comment(response));
          })
          .error(function (response) {
            that.displayWarning(response.responseJSON[0].message);
          });
      }
    },

    slideUpAndDestroy: function () {
      var that = this;
      $(this.el).slideUp('slow', function() {
        that.destroy();
      });
    },

    cancelReply: function (ev) {
      ev.preventDefault();
      this.slideUpAndDestroy();
    },

    validateForm: function () {
      var valid = true;

      this.$('.form-group').each(function (index, group) {
        $(group).removeClass('has-error');

        $(group).find('.required').each(function(index, input) {
          if (_.isEmpty($(input).val())) {
            $(group).addClass('has-error');
            valid = false;
          }
        });
      }.bind(this));

      if (!valid) {
        this.displayWarning('Please fill all required fields.');
      } else {
        this.resetWarning();
      }

      return valid;
    },

    resetWarning: function () {
        $('#b3-warning').removeClass('alert alert-danger').text('');
    },

    displayWarning: function (message) {
      $('#b3-warning').addClass('alert alert-danger').text(message);

      if (_.isEmpty(message)) {
        this.resetWarning();
      }
    },

    getComment: function () {
      return new Comment({
        content:        this.$('[name="comment_content"]').val(),
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
        name:  this.$('[name="author_name"]').val(),
        email: this.$('[name="author_email"]').val(),
        URL:   this.$('[name="author_url"]').val()
      });
    }

  });

  return ReplyFormView;
});

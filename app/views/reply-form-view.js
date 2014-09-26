/* global define */

define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'buses/event-bus',
  'models/user-model',
  'templates/forms/replyform-template'
], function ($, _, Backbone, Marionette, EventBus, User) {
  'use strict';

  var ReplyFormView = Backbone.Marionette.ItemView.extend({
    template: 'forms/replyform-template.dust',
    events: {
      'click .cancel':          'onCancelClicked',
      'click .reply':           'onReplyClicked',
      'submit #replyform form': 'onReplyClicked'
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
      this._slideUp();
      ev.preventDefault();
    },

    onReplyClicked: function (ev) {
      ev.preventDefault();

      if (this._validateForm()) {
        EventBus.trigger('replyform:view:reply', this._getComment());
      }
    },

    displayWarning: function (message) {
      this.$('#warning').addClass('alert alert-danger').text(message);

      if (_.isEmpty(message)) {
        this._resetWarning();
      }
    },

    _slideUp: function () {
      this.$el.slideUp('slow', function() {
        EventBus.trigger('replyform:view:cancel');
        this.destroy();
      }.bind(this));
    },

    _validateForm: function () {
      var valid = this._validateFormGroup();

      if (!valid) {
        this.displayWarning('Please fill all required fields.');
      } else {
        this._resetWarning();
      }

      return valid;
    },

    _resetWarning: function () {
      this.$('#warning').removeClass('alert alert-danger').text('');
    },

    _validateFormGroup: function () {
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

      return valid;
    },

    _getComment: function () {
      return {
        content:        this.$('[name="comment_content"]').val(),
        post:           this.post.get('ID'),
        parent_comment: this.parentId,
        author:         this._getUser()
      };
    },

    _getUser: function () {
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

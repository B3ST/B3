/* global define */

define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'buses/event-bus',
  'buses/command-bus',
  'models/settings-model',
  'models/user-model',
  'behaviors/behaviors'
], function ($, _, Backbone, Marionette, EventBus, CommandBus, Settings, User) {
  'use strict';

  var Reply = Marionette.Behavior.extend({
    events: {
      'click @ui.replyButton':  'displayReplyForm',
      'click @ui.submitButton': 'onSubmitReply',
      'submit @ui.replyForm':   'onSubmitReply'
    },

    displayReplyForm: function (ev) {
      var replyButton = $(ev.currentTarget),
          id     = _.uniqueId('reply-form-container'),
          region = new Marionette.Region({ el: '#' + id });

      if (this.$('.reply-form').length === 0) {
        this._displayReplyForm(replyButton, id, region);
        this._bindToEvents();
        this.triggerMethod('reply:clicked');
      }

      return false;
    },

    showButton: function (options) {
      if (options.id === this._parentId()) {
        this.button.fadeIn('fast');
        this.$('.reply-form').remove();
        EventBus.off('replyform:cancel', this.showButton, this);
      }
    },

    onSubmitReply: function (ev) {
      ev.preventDefault();

      if (this._validateForm()) {
        EventBus.trigger('replyform:view:reply', this._getComment());
      }
    },

    _validateForm: function () {
      var valid = this._validateFormGroup();

      if (!valid) {
        this.view.displayWarning('Please fill all required fields.');
      } else {
        this.view.resetWarning();
      }

      return valid;
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
        post:           this.view.post.get('ID'),
        parent_comment: this.view.parentId,
        author:         this._getUser()
      };
    },

    _getUser: function () {
      if (this.view.user.isLoggedIn()) {
        return this.view.user;
      }

      return new User({
        name:  this.$('[name="author_name"]').val(),
        email: this.$('[name="author_email"]').val(),
        URL:   this.$('[name="author_url"]').val()
      });
    },

    _displayReplyForm: function (button, id, region) {
      this.button = button;
      $(this.button).after('<div id="' + id + '" class="reply-form"></div>');
      CommandBus.execute('reply:form:show', this._getOptions(region));
      $(this.button).fadeOut('fast');
    },

    _bindToEvents: function () {
      EventBus.on('replyform:cancel', this.showButton, this);
    },

    _getOptions: function (region) {
      return {
        region:     region,
        post:       this._post(),
        user:       Settings.get('me'),
        parentView: this,
        parentId:   this._parentId()
      };
    },

    _post: function () {
      return _.isFunction(this.view.getPost) ? this.view.getPost() : this.view.model;
    },

    _parentId: function () {
      return _.isFunction(this.view.parentId) ? this.view.parentId() : 0;
    }

  });

  window.Behaviors.Reply = Reply;

  return Reply;
});

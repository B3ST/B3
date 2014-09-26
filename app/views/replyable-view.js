/* global define */

define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'buses/command-bus',
  'buses/event-bus',
  'models/settings-model'
], function ($, _, Backbone, Marionette, CommandBus, EventBus, Settings) {
  'use strict';

  var ReplyableView = Backbone.Marionette.CompositeView.extend({
    events: {
      'click .reply': 'renderReplyBox',
    },

    renderReplyBox: function (ev) {
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

    parentId: function () {
      return 0;
    },

    getPost: function () {
      return this.model;
    },

    showButton: function (options) {
      if (options.id === this.parentId()) {
        this.button.fadeIn('fast');
        this.$('.reply-form').remove();
        EventBus.off('replyform:cancel', this.showButton, this);
      }
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
        post:       this.getPost(),
        user:       Settings.get('me'),
        parentView: this,
        parentId:   this.parentId()
      };
    }
  });

  return ReplyableView;
});

/* global define */

define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'controllers/bus/command-bus'
  /* jshint unused: false */
], function ($, _, Backbone, Marionette, CommandBus) {
  'use strict';

  var LoadingView = Backbone.Marionette.ItemView.extend({
    initialize: function () {
      _.bindAll(this, 'show', 'hide', 'progress');
      CommandBus.setHandler('loading:show', this.show);
      CommandBus.setHandler('loading:hide', this.hide);
      CommandBus.setHandler('loading:progress', this.progress);
    },

    show: function (options) {
      $('.loading-container').show(); // TODO: this.$el.show()
    },

    hide: function () {
      $('.loading-container').hide(); // TODO: this.$el.hide()
    },

    progress: function (options) {
      var progress = options.loaded / options.total * 100;

      $('.loading-container .progress-bar')  // TODO: this.$('.progress')...
        .prop('aria-valuenow', progress)
        .css('width', progress + '%');
    }
  });

  return LoadingView;
});

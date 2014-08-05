/* global define */

define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'dust',
  'dust.marionette',
  'controllers/bus/command-bus',
  'loading-template'
  /* jshint unused: false */
], function ($, _, Backbone, Marionette, dust, dustMarionette, CommandBus) {
  'use strict';

  var LoadingView = Backbone.Marionette.ItemView.extend({
    template: 'loading-template.dust',
    tagName:  'div id="loading"',

    initialize: function () {
      _.bindAll(this, 'show', 'hide', 'progress');
      CommandBus.setHandler('loading:show', this.show);
      CommandBus.setHandler('loading:hide', this.hide);
      CommandBus.setHandler('loading:progress', this.progress);
    },

    show: function (options) {
      this.$el.show();
    },

    hide: function () {
      this.$el.hide();
    },

    progress: function (options) {
      var progress = options.loaded / options.total * 100;

      this.$('.screen-reader-text').prop('aria-valuenow', progress)
                                   .css('width', progress + '%')
                                   .text(progress + '% Complete');
    }
  });

  return LoadingView;
});

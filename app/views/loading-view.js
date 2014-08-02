/* global define */

define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'controllers/command-bus'
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
      $('.loading').show();
    },

    hide: function () {
      $('.loading').hide();
    },

    progress: function (options) {
      var placeholder = '.loading > div.progress > div.progress-bar',
          progress = options.loaded/options.total * 100;
      $(placeholder).attr('aria-valuenow', progress)
                    .css('width', progress + '%');
    }
  });

  return LoadingView;
});
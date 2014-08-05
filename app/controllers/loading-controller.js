/* global define */

define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'controllers/bus/command-bus',
  'views/loading-view'
], function ($, _, Backbone, Marionette, CommandBus, LoadingView) {
  'use strict';

  return Marionette.Controller.extend({
    initialize: function (options) {
      this.region = options.region;
      this._bindToCommands();
    },

    showView: function () {
      if (this.region) {
        this.loading = this._loadingView();
        this.region.show(this.loading);
      }
    },

    removeView: function () {
      if (this.loading) {
        this.loading.destroy();
        this.loading = null;
      }
    },

    displayProgress: function (data) {
      if (this.loading) {
        this.loading.progress(data);
      }
    },

    _bindToCommands: function () {
      _.bindAll(this, 'showView', 'removeView', 'displayProgress');
      CommandBus.setHandler('loading:show', this.showView);
      CommandBus.setHandler('loading:hide', this.removeView);
      CommandBus.setHandler('loading:progress', this.displayProgress);
    },

    _loadingView: function () {
      var loadingView = new LoadingView();
      loadingView.render();
      return loadingView;
    }
  });
});
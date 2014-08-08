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

    /**
     * Display a loading view in a given region
     */
    displayLoading: function () {
      this.loading = this._loadingView();
      this.region.show(this.loading);
      this.isDisplaying = true;
    },

    /**
     * Display the current progress
     * @param  {Object} data An object containing the current progress (total and loaded)
     */
    displayProgress: function (data) {
      if (this.isDisplaying) {
        this.loading.progress(data);
      }
    },

    _bindToCommands: function () {
      _.bindAll(this, 'displayProgress');
      CommandBus.setHandler('loading:progress', this.displayProgress);
    },

    _loadingView: function () {
      var loadingView = new LoadingView();
      this.listenTo(loadingView, 'destroy', this.destroy);

      loadingView.render();
      return loadingView;
    }
  });
});
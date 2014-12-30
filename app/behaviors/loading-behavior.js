/* global define */

define([
  'backbone',
  'marionette',
  'buses/command-bus'
], function (Backbone, Marionette, CommandBus) {
  'use strict';

  var Loading = Marionette.Behavior.extend({

    onShow: function () {
      CommandBus.setHandler('loading:progress', this.displayProgress, this);
    },

    onBeforeDestroy: function () {
      CommandBus.removeHandler('loading:progress', this.displayProgress, this);
    },

    /**
     * Display the current progress
     * @param  {Object} data An object containing the current progress (total and loaded)
     */
    displayProgress: function (data) {
      this.view.progress(data);
    }
  });

  window.Behaviors.Loading = Loading;

  return Loading;
});
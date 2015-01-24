/* global define */

define([
  'backbone',
  'marionette',
  'buses/command-bus',
  'behaviors/behaviors'
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
     * @param  {Object} options An object containing the current progress (total and loaded)
     */
    displayProgress: function (options) {
      var progress = options.loaded / options.total * 100;

      this.view.$('.progress-bar').prop('aria-valuenow', progress)
                                  .css('width', progress + '%');
      this.view.$('.screen-reader-text').text(progress + '% Complete');
    }
  });

  window.Behaviors.Loading = Loading;

  return Loading;
});

/* global define */

define([
  'backbone',
  'marionette',
  'behaviors/behaviors'
], function (Backbone, Marionette) {
  'use strict';

  var Heartbeat = Marionette.Behavior.extend({

    onBeforeDestroy: function () {
      this.view.collection.stopHeartbeat();
    }

  });

  /**
   * Register behavior.
   * @type {Heartbeat}
   */
  window.Behaviors.Heartbeat = Heartbeat;

  return Heartbeat;
});

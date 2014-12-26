/* global define */

define([
  'backbone',
  'marionette',
  'buses/event-bus'
], function (Backbone, Marionette, EventBus) {
  'use strict';

  var NavigationHome = Marionette.Behavior.extend({
    defaults: {
      event: 'header:view:index'
    },

    events: {
      'click @ui.homeLink': 'onHomeLinkClicked'
    },

    /**
     * Homelink activation handler.
     * @param {Event} event Click event.
     */
    onHomeLinkClicked: function (event) {
      EventBus.trigger(this.options.event, { id: 0 });
      event.preventDefault();
    }
  });

  /**
   * Register behavior.
   * @type {NavigationHome}
   */
  window.Behaviors.NavigationHome = NavigationHome;

  return NavigationHome;
});

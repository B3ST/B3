/* global define */

define([
  'backbone',
  'marionette',
  'buses/event-bus'
], function (Backbone, Marionette, EventBus) {
  'use strict';

  var NavigationHome = Marionette.Behavior.extend({

    events: {
      'click @ui.homeLink': 'onHomeLinkClicked'
    },

    /**
     * Homelink activation handler.
     * @param {Event} event Click event.
     */
    onHomeLinkClicked: function (event) {
      EventBus.trigger('header:view:index', {id: 0});
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

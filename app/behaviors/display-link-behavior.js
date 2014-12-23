/* global define */

define([
  'backbone',
  'marionette',
  'buses/event-bus'
], function (Backbone, Marionette, EventBus) {
  'use strict';

  var DisplayLink = Marionette.Behavior.extend({
    events: {
      'click @ui.link': 'onLinkClicked'
    },

    /**
     * Content link activation handler.
     * @param {Event} event Click event.
     */
    onLinkClicked: function (event) {
      var link = $(event.currentTarget).attr('href');
      EventBus.trigger(this.options.event, { href: link });
      event.preventDefault();
    }
  });

  /**
   * Register behavior.
   * @type {DisplayLink}
   */
  window.Behaviors.DisplayLink = DisplayLink;

  return DisplayLink;
});

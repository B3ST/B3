/* global define */

define([
  'backbone',
  'marionette',
  'buses/event-bus'
], function (Backbone, Marionette, EventBus) {
  'use strict';

  var NavigationURL = Marionette.Behavior.extend({

    events: {
      'click @ui.taxonomyLink': 'onTaxonomyLinkClicked',
      'click @ui.link':         'onLinkClicked'
    },

    onTaxonomyLinkClicked: function (event) {
      var link = $(event.currentTarget).attr('href');
      EventBus.trigger('archive:view:display:taxonomy', { href: link });
      event.preventDefault();
    },

    /**
     * Content link activation handler.
     * @param {Event} event Click event.
     */
    onLinkClicked: function (event) {
      var link = $(event.currentTarget).attr('href');
      EventBus.trigger('archive:view:link:clicked', { href: link });
      event.preventDefault();
    }
  });

  /**
   * Register behavior.
   * @type {NavigationURL}
   */
  window.Behaviors.NavigationURL = NavigationURL;

  return NavigationURL;
});

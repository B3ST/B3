/* global define */

define([
  'backbone',
  'marionette',
  'buses/event-bus'
], function (Backbone, Marionette, EventBus) {
  'use strict';

  var DisplayTaxonomy = Marionette.Behavior.extend({
    events: {
      'click @ui.taxonomyLink': 'onTaxonomyLinkClicked'
    },

    /**
     * Taxonomy link activation handler.
     * @param {Event} event Click event.
     */
    onTaxonomyLinkClicked: function (event) {
      var link = $(event.currentTarget).attr('href');
      EventBus.trigger(this.options.event, { href: link });
      event.preventDefault();
    }
  });

  /**
   * Register behavior.
   * @type {DisplayTaxonomy}
   */
  window.Behaviors.DisplayTaxonomy = DisplayTaxonomy;

  return DisplayTaxonomy;
});

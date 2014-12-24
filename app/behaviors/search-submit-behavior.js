/* global define */

/**
 * TODO: Should this behavior hold attributes like previousSearch,
 * or should we leave it in the view?
 */

define([
  'backbone',
  'marionette',
  'buses/event-bus'
], function (Backbone, Marionette, EventBus) {
  'use strict';

  var SearchSubmit = Marionette.Behavior.extend({

    /**
     * Behavior events.
     * @type {Object}
     */
    events: {
      'submit': 'onSearchSubmit',
    },

    /**
     * Triggers a search request on submit.
     * @param {Event} event Search form submit event.
     */
    onSearchSubmit: function (event) {
      var search = $(event.currentTarget).find(this.view.ui.search).val();

      if (search.length > 0) {
        EventBus.trigger(this.options.event, { search: search });
      }

      return false;
    }
  });

  /**
   * Register search term input behavior.
   * @type {SearchTerm}
   */
  window.Behaviors.SearchSubmit = SearchSubmit;

  return SearchSubmit;
});

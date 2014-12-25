/* global define */

define([
  'backbone',
  'marionette',
  'buses/event-bus'
], function (Backbone, Marionette, EventBus) {
  'use strict';

  var SearchReset = Marionette.Behavior.extend({

    defaults: {
      event: 'search:reset'
    },

    events: {
      'change @ui.search': 'onSearchChange',
      'keyup @ui.search':  'onSearchChange'
    },

    /**
     * Triggers a search results reset on an empty search field.
     * @param {Event} event Search field value change event.
     */
    onSearchChange: function (event) {
      var search = $(event.currentTarget).val();

      if (search.length === 0) {
        EventBus.trigger(this.options.event);
        event.preventDefault();
      }
    }
  });

  /**
   * Register search reset behavior.
   * @type {SearchReset}
   */
  window.Behaviors.SearchReset = SearchReset;

  return SearchReset;
});

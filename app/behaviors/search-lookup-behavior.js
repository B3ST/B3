/* global define */

/**
 * TODO: Should this behavior hold attributes like previousSearch,
 * or should we leave it in the view? Or should it be a behavior
 * option?
 */

define([
  'backbone',
  'marionette',
  'buses/event-bus'
], function (Backbone, Marionette, EventBus) {
  'use strict';

  var SearchLookup = Marionette.Behavior.extend({

    /**
     * Timeout ID.
     * @type {Number}
     */
    _timeoutId: 0,

    /**
     * Previous search terms.
     * @type {String}
     */
    _previousSearch: '',

    /**
     * Behavior option defaults.
     * @type {Object}
     */
    defaults: {
      event: 'search:lookup',
      min:   3,
      delay: 500
    },

    /**
     * Behavior events.
     * @type {Object}
     */
    events: {
      'change @ui.search': 'onSearchChange',
      'keyup @ui.search':  'onSearchChange'
    },

    /**
     * Triggers a search request on input.
     * @param {Event} event Search field value change event.
     */
    onSearchChange: function (event) {
      var search = $(event.currentTarget).val(),
        behavior = this;

      if (this._isSearchTermValid(event)) {
        this._triggerAfterDelay(function () {
          EventBus.trigger(behavior.options.event, { search: search });
        }, behavior.options.delay);
      }

      this._previousSearch = search;

      return false;
    },

    /**
     * [_searchTermValid description]
     * @param  {[type]}  event  [description]
     * @return {Boolean}        Whether a search request should be triggered.
     */
    _isSearchTermValid: function (event) {
      var search = $(event.currentTarget).val();

      return search.length >= this.options.min && search !== this._previousSearch;
    },

    /**
     * Waits for the user to stop typing into the form input
     * before triggering a search request.
     *
     * @param  {Function} callback Function to call after delay.
     * @param  {int}      delay    Time to wait, in milliseconds.
     * @return {Function}            [description]
     */
    _triggerAfterDelay: function (callback, delay) {
      window.clearTimeout(this._timeoutId);
      this._timeoutId = window.setTimeout(callback, delay);
    }
  });

  /**
   * Register search term input behavior.
   * @type {SearchLookup}
   */
  window.Behaviors.SearchLookup = SearchLookup;

  return SearchLookup;
});

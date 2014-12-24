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

  var SearchTerm = Marionette.Behavior.extend({

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
      min: 3
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
        }, 500);
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

      return search.length >= this.options.min &&
             search !== this._previousSearch &&
             event.keyCode !== 8 && // backspace
             event.keyCode !== 46; // delete
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
   * @type {SearchTerm}
   */
  window.Behaviors.SearchTerm = SearchTerm;

  return SearchTerm;
});

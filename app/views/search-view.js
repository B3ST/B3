/* global define */

define([
  'backbone',
  'marionette',
  'buses/event-bus',
  'templates/forms/navigation-search-template'
  /* jshint unused: false */
], function (Backbone, Marionette, EventBus) {
  'use strict';

  var SearchView = Backbone.Marionette.ItemView.extend({
    template:  'forms/navigation-search-template.dust',
    events: {
      'submit':                   'onSubmitSearch',
      'keyup input#search-site':  'onKeyupSearch',
      'change input#search-site': 'onChangeSearch'
    },

    initialize: function (options) {
      options             = options || {};
      this.searchId       = options.searchId || 'search-nav-bar';
      this.previousSearch = '';
      this.timeoutId      = 0;
    },

    onRender: function () {
      this.$el.attr('id', this.searchId);
    },

    onSubmitSearch: function (ev) {
      var search = this.$('#search-site').val();
      if (search.length > 2) {
        EventBus.trigger('search:view:search:submit', { search: search });
      }

      return false;
    },

    onKeyupSearch: function (ev) {
      this._searchSite(this.$('#search-site').val(), ev);
      ev.preventDefault();
    },

    onChangeSearch: function (ev) {
      this._searchSite(this.$('#search-site').val(), ev);
      ev.preventDefault();
    },

    _searchSite: function (search, ev) {
      if (search.length === 0) {
        EventBus.trigger('search:view:search:empty');
      }

      if (this._searchTermValid(ev, search)) {
        this._triggerAfterDelay(function () {
          EventBus.trigger('search:view:search:term', { search: search });
        }, 500);
      }

      this.previousSearch = search;
      return false;
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
      window.clearTimeout(this.timeoutId);
      this.timeoutId = window.setTimeout(callback, delay);
    },

    _searchTermValid: function (event, search) {
      return search.length > 2              &&
             search !== this.previousSearch &&
             event.keyCode !== 8            && // backspace
             event.keyCode !== 46;             // delete
    }
  });

  return SearchView;
});

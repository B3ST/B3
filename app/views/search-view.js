/* global define */

define([
  'jquery',
  'backbone',
  'marionette',
  'buses/event-bus',
  'controllers/navigation/navigator',
  'forms/navigation-search-template'
  /* jshint unused: false */
], function ($, Backbone, Marionette, EventBus, Navigator) {
  'use strict';

  var SearchView = Backbone.Marionette.ItemView.extend({
    template:  "forms/navigation-search-template.dust",
    tagName:   'div id=""',

    events: {
      'submit':                   'searchSite',
      'keyup input#search-site':  'searchSite',
      'change input#search-site': 'searchSite'
    },

    initialize: function (options) {
      this.searchId       = options.searchId || 'search-nav-bar';
      this.previousRoute  = '';
      this.previousSearch = '';
      this.timeoutId      = 0;
    },

    onRender: function () {
      this.$el.attr('id', this.searchId);
    },

    searchSite: function (event) {
      var search = this.$('#search-site').val();

      event.preventDefault();

      if (search.length === 0) {
        this._triggerSearchStop();

      } else if (this.previousSearch.length === 0) {
        this._triggerSearchStart();

      } else if (event.type === 'submit') {
        this._triggerSubmitSearchTerm(search);
      }

      if (this._shouldTriggerSearch(event, search)) {
        this._triggerAfterDelay(function () {
          this._triggerSearchTerm(search);
        }.bind(this), 500);
      }

      this.previousSearch = search;
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

    _triggerSearchStart: function () {
      EventBus.trigger('search:view:start');
    },

    _triggerSearchTerm: function (search) {
      EventBus.trigger('search:view:term', {s: search});
    },

    _triggerSubmitSearchTerm: function (search) {
      EventBus.trigger('search:view:submit', {s: search});
    },

    _triggerSearchStop: function () {
      EventBus.trigger('search:view:stop');
    },

    _shouldTriggerSearch: function (event, search) {
      return search.length > 2              &&
             search !== this.previousSearch &&
             event.keyCode !== 8            && // backspace
             event.keyCode !== 46;             // delete
    }
  });

  return SearchView;
});

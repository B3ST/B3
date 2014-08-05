/* global define */

define([
  'jquery',
  'backbone',
  'marionette',
  'controllers/bus/event-bus',
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
      var view   = this;
      var search = $(event.currentTarget).val();

      event.preventDefault();

      if (search.length === 0) {
        this.triggerSearchEnd();

      } else if (this.previousSearch.length === 0) {
        this.triggerSearchStart();

      } else if (event.keyCode === 13) {
        this.triggerSubmitSearchTerm(search);
      }

      if (search.length > 2 && search !== this.previousSearch) {
        this.triggerAfterDelay(function () {
          view.triggerSearchTerm(search);
        }, 500);
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
    triggerAfterDelay: function (callback, delay) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = window.setTimeout(callback, delay);
    },

    triggerSearchStart: function () {
      var route = Navigator.getRoute();
      if (route.indexOf('s=') === -1) {
        this.previousRoute = route;
      }
      EventBus.trigger('search:start');
    },

    triggerSearchTerm: function (search) {
      EventBus.trigger('search:term', {s: search});
    },

    triggerSubmitSearchTerm: function (search) {
      this.triggerSearchTerm(search);
      Navigator.navigate('post?s=' + search, false);
    },

    triggerSearchEnd: function () {
      EventBus.trigger('search:end');
      Navigator.navigate(this.previousRoute, false);
    }
  });

  return SearchView;
});

/* global define */

define([
  'jquery',
  'backbone',
  'marionette',
  'controllers/event-bus',
  'controllers/navigator',
  'forms/navigation-search-template'
  /* jshint unused: false */
], function ($, Backbone, Marionette, EventBus, Navigator) {
  'use strict';

  var SearchView = Backbone.Marionette.ItemView.extend({
    template: "forms/navigation-search-template.dust",
    tagName:  'div id=""',

    events: {
      'submit':                  'searchSite',
      'keyup input#search-site': 'searchSite'
    },

    initialize: function (options) {
      this.searchId      = options.searchId || 'search-nav-bar';
      this.previousRoute = '';
    },

    onRender: function () {
      this.$el.attr('id', this.searchId);
    },

    searchSite: function (event) {
      var search = $(event.currentTarget).val();

      event.preventDefault();
      if (search.length === 0) {
        this.triggerSearchEnd();
      } else if (search.length <= 3) {
        this.triggerSearchStart();
      } else {
        this.triggerSearchTerm(search, event);
      }
    },

    triggerSearchStart: function () {
      var route = Navigator.getRoute();
      if (route.indexOf('s=') === -1) {
        this.previousRoute = route;
      }

      EventBus.trigger('search:start');
    },

    triggerSearchTerm: function (search, event) {
      EventBus.trigger('search:term', {s: search});
      if (event.keyCode === 13) {
        Navigator.navigate('post?s=' + search, false);
      }
    },

    triggerSearchEnd: function () {
      EventBus.trigger('search:end');
      Navigator.navigate(this.previousRoute, false);
    }
  });

  return SearchView;
});
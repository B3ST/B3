/* global define */

define([
  'backbone',
  'marionette',
  'buses/event-bus',
  // Behaviors
  'behaviors/search-behavior',
  // Templates
  'templates/forms/navigation-search-template'
  /* jshint unused: false */
], function (Backbone, Marionette, EventBus) {
  'use strict';

  var SearchView = Backbone.Marionette.ItemView.extend({

    template:  'forms/navigation-search-template.dust',

    ui: {
      searchForm:  'form#search-site',
      searchField: 'form#search-site input#s'
    },

    behaviors: {
      Search: { min: 3 }
    },

    initialize: function (options) {
      options       = options || {};
      this.searchId = options.searchId || 'search-nav-bar';
    },

    onRender: function () {
      this.$el.attr('id', this.searchId);
    }
  });

  return SearchView;
});

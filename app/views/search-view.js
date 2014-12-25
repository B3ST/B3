/* global define */

define([
  'backbone',
  'marionette',
  'buses/event-bus',
  // Behaviors
  'behaviors/search-lookup-behavior',
  'behaviors/search-reset-behavior',
  'behaviors/search-submit-behavior',
  // Templates
  'templates/forms/navigation-search-template'
  /* jshint unused: false */
], function (Backbone, Marionette, EventBus) {
  'use strict';

  var SearchView = Backbone.Marionette.ItemView.extend({

    template:  'forms/navigation-search-template.dust',

    ui: {
      'search': 'input#search-site'
    },

    behaviors: {
      SearchLookup: { min: 3 },
      SearchReset:  {},
      SearchSubmit: {}
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

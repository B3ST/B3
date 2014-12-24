/* global define */

define([
  'backbone',
  'marionette',
  'buses/event-bus',
  // Behaviors
  'behaviors/search-reset-behavior',
  'behaviors/search-term-behavior',
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
      SearchReset:  { event: 'search:view:search:empty' },
      SearchTerm:   { event: 'search:view:search:term', min: 3 },
      SearchSubmit: { event: 'search:view:search:submit' }
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

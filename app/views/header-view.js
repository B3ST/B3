/* global define */

define([
  'backbone',
  'buses/event-bus',
  'models/settings-model',
  'behaviors/navigation-behavior',
  'templates/header-template'
], function (Backbone, EventBus, Settings) {
  'use strict';

  var HeaderView = Backbone.Marionette.LayoutView.extend({
    template: 'header-template.dust',

    ui: {
      navigationLink: 'a.navbar-brand'
    },

    behaviors: {
      Navigation: {}
    },

    regions: {
      search: '#search-region',
      menu:   '#menu-region'
    },

    serializeData: function () {
      return {
        name:     Settings.get('name'),
        site_url: Settings.get('site_url')
      };
    }
  });

  return HeaderView;
});

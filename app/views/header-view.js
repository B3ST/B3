/* global define */

define([
  'backbone',
  'buses/event-bus',
  'models/settings-model',
  'templates/header-template'
], function (Backbone, EventBus, Settings) {
  'use strict';

  var HeaderView = Backbone.Marionette.LayoutView.extend({
    template: 'header-template.dust',

    ui: {
      'homeLink': '.navbar-brand'
    },

    triggers: {
      'click @ui.homeLink': 'HomeLinkClicked'
    },

    regions: {
      search: '#search-region',
      menu:   '#menu-region'
    },

    serializeData: function () {
      return { name: Settings.get('name') };
    },

    onHomeLinkClicked: function (event) {
      EventBus.trigger('header:view:index', {id: 0});
      event.preventDefault();
    }
  });

  return HeaderView;
});

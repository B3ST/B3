/* global define */

define([
  'backbone',
  'models/settings-model',
  'buses/event-bus',
  'buses/navigator',
  'templates/header-template'
], function (Backbone, Settings, EventBus, Navigator) {
  'use strict';

  var HeaderView = Backbone.Marionette.LayoutView.extend({
    template: 'header-template.dust',
    events: {
      'click .navbar-brand': 'index',
    },

    regions: {
      search: '#search-region',
      menu:   '#menu-region'
    },

    serializeData: function () {
      return { name: Settings.get('name') };
    },

    index: function (ev) {
      Navigator.navigateToHome('', null, true);
      EventBus.trigger('menu-item:select', {id: -1});
      ev.preventDefault();
    }
  });

  return HeaderView;
});

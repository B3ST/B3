/* global define */

define([
  'backbone',
  'models/settings-model',
  'buses/event-bus',
  'templates/header-template'
], function (Backbone, Settings, EventBus) {
  'use strict';

  var HeaderView = Backbone.Marionette.LayoutView.extend({
    template: 'header-template.dust',
    events: {
      'click .navbar-brand': 'onIndexClicked',
    },

    regions: {
      search: '#search-region',
      menu:   '#menu-region'
    },

    serializeData: function () {
      return { name: Settings.get('name') };
    },

    onIndexClicked: function (ev) {
      EventBus.trigger('header:view:index', { id: -1 });
      ev.preventDefault();
    }
  });

  return HeaderView;
});

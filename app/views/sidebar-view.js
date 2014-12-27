/* global define */

define([
  'underscore',
  'backbone',
  'marionette',
  'buses/event-bus',
  'behaviors/navigation-behavior',
  'templates/widget-areas/sidebar-template'
], function (_, Backbone, Marionette, EventBus) {
  'use strict';

  var SidebarView = Backbone.Marionette.ItemView.extend({

    ui: {
      navigationLink: 'a'
    },

    behaviors: {
      Navigation: {}
    },

    serializeData: function () {
      return { widgets: this.model.getWidgets().toJSON() };
    }
  });

  return SidebarView;
});

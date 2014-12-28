/* global define */

define([
  'backbone',
  'marionette',
  'behaviors/navigation-behavior',
  'templates/widget-areas/sidebar-template'
], function (Backbone) {
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

/* global define */

define([
  'underscore',
  'backbone',
  'marionette',
  'buses/event-bus',
  'templates/widget-areas/sidebar-template'
], function (_, Backbone, Marionette, EventBus) {
  'use strict';

  var SidebarView = Backbone.Marionette.ItemView.extend({
    events: {
      'click a': 'onLinkClicked'
    },

    onLinkClicked: function (ev) {
      EventBus.trigger('sidebar:view:link', { link: ev.currentTarget.href });
      ev.preventDefault();
    },

    serializeData: function () {
      return { widgets: this.model.getWidgets().toJSON() };
    }
  });

  return SidebarView;
});
/* global define */

define([
  'jquery',
  'backbone',
  'collections/widget-collection'
], function ($, Backbone, Widgets) {
  'use strict';

  var Sidebar = Backbone.Model.extend({
    defaults: {
      name:        '',
      id:          '',
      description: '',
      class:       '',
      widgets:     [],
      meta:        {}
    },

    url: function () {
      return this.get('meta').links.self;
    },

    getWidgets: function () {
      return new Widgets(this.get('widgets'));
    }
  });

  return Sidebar;
});
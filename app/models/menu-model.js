'use strict';

define([
  'jquery',
  'backbone',
  'collections/menu-item-collection'
], function ($, Backbone, MenuItems) {
  var Menu = Backbone.Model.extend({
    defaults: {
      location: '',
      name:     '',
      menu:     {},
      meta:     {}
    },

    url: function () {
      var meta = this.get('meta');
      return (meta ? meta.links.self : '');
    },

    getItems: function () {
      return new MenuItems(this.get('menu').items);
    }
  });

  return Menu;
});
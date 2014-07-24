'use strict';

define([
  'jquery',
  'backbone',
  'collections/item-collection'
], function ($, Backbone, Items) {
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
      return new Items(this.get('menu').items);
    }
  });

  return Menu;
});
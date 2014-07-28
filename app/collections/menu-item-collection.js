/* global define */

define([
  'jquery',
  'backbone',
  'models/menu-item-model'
], function ($, Backbone, MenuItem) {
  'use strict';
  var MenuItems = Backbone.Collection.extend({
    model: MenuItem,
    comparator: function (item) {
      return [item.get('order'), item.get('ID'), item.get('parent')];
    }
  });

  return MenuItems;
});

define([
  'jquery',
  'backbone',
  'models/menu-item-model'
], function ($, Backbone, MenuItem) {
  var MenuItems = Backbone.Collection.extend({
    model: MenuItem,
    comparator: function (item) {
      return [item.get('order'), item.get('ID'), item.get('parent')];
    }
  });

  return MenuItems;
});
define([
  'jquery',
  'backbone',
  'models/item-model'
], function ($, Backbone, Item) {
  var Items = Backbone.Collection.extend({
    model: Item
  });

  return Items;
});
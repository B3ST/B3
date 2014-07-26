define([
  'jquery',
  'backbone',
  'models/item-model'
], function ($, Backbone, Item) {
  'use strict';
  var Items = Backbone.Collection.extend({
    model: Item
  });

  return Items;
});

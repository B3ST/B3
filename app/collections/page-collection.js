define([
  'jquery',
  'backbone',
  'models/page-model'
], function (Page) {
  var Pages = Backbone.Collection.extend({
    model: Page
  });

  return Pages;
});
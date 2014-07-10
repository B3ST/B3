define([
  'jquery',
  'backbone',
  'models/taxonomy-model'
], function ($, Backbone, Taxonomy) {
  var Taxonomies = Backbone.Collection.extend({
    model: Taxonomy
  });

  return Taxonomies;
});
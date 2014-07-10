define([
  'jquery',
  'backbone',
  'models/taxonomy-model',
  'models/settings-model'
], function ($, Backbone, Taxonomy, Settings) {
  var Taxonomies = Backbone.Collection.extend({
    model: Taxonomy,
    url: Settings.get('url') + '/taxonomies'
  });

  return Taxonomies;
});
/* global define */

define([
  'jquery',
  'backbone',
  'models/taxonomy-model',
  'models/settings-model'
], function ($, Backbone, Taxonomy, Settings) {
  'use strict';
  var Taxonomies = Backbone.Collection.extend({
    model: Taxonomy,
    url: Settings.get('apiUrl') + '/taxonomies'
  });

  return Taxonomies;
});

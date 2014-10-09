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

    initialize: function (options) {
      options  = options || {};
      this.uri = options.uri || this._defaultUrl();
    },

    url: function () {
      return this.uri;
    },

    _defaultUrl: function () {
      return Settings.get('api_url') + '/taxonomies';
    }
  });

  return Taxonomies;
});

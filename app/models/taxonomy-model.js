/* global define */

define([
  'backbone'
], function (Backbone) {
  'use strict';

  var Taxonomy = Backbone.Model.extend({
    defaults: {
      name         : '',
      slug         : null,
      labels       : {},
      types        : {},
      meta         : {},
      show_cloud   : false,
      hierarchical : false
    },

    idAttribute: 'slug'
  });

  return Taxonomy;
});

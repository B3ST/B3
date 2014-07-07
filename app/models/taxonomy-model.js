define([
  'jquery',
  'backbone'
], function ($, Backbone) {
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

    idAttribute: 'slug',
    urlRoot: '/taxonomies',

    fetchTerms: function (id) {
      id = id || '';
      return $.isEmptyObject(this.get('meta')) ? false : $.get(this.get('meta').links.archives);
    }
  });

  return Taxonomy;
});
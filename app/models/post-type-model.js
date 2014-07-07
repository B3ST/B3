define([
  'jquery',
  'backbone'
], function ($, Backbone) {
  var PostType = Backbone.Model.extend({
    defaults: {
      slug         : null,
      name         : '',
      taxonomies   : [],
      labels       : {},
      meta         : {},
      queryable    : false,
      searchable   : false,
      hierarchical : false
    },

    idAttribute: 'slug',
    urlRoot: '/posts/types'
  });

  return PostType;
});
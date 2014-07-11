define([
  'jquery',
  'backbone',
  'models/settings-model'
], function ($, Backbone, Settings) {
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
    urlRoot: Settings.get('url') + '/posts/types'
  });

  return PostType;
});
define([
  'jquery',
  'backbone'
], function ($, Backbone) {
  var PostStatus = Backbone.Model.extend({
    defaults: {
      name         : '',
      slug         : null,
      meta         : {},
      'public'     : true,
      queryable    : true,
      show_in_list : true,
      'protected'  : false,
      'private'    : false
    },

    idAttribute: 'slug',
    urlRoot: '/posts/statuses'
  });

  return PostStatus;
});
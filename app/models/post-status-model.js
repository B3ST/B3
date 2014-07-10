define([
  'jquery',
  'backbone',
  'models/settings-model'
], function ($, Backbone, Settings) {
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
    urlRoot: Settings.get('url') + '/posts/statuses'
  });

  return PostStatus;
});
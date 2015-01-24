/* global define */

define([
  'jquery',
  'backbone',
  'models/settings-model'
], function ($, Backbone, Settings) {
  'use strict';
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
    urlRoot: Settings.get('api_url') + '/posts/statuses'
  });

  return PostStatus;
});

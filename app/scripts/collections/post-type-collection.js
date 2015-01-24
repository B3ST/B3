/* global define */

define([
  'jquery',
  'backbone',
  'models/post-type-model',
  'models/settings-model'
], function ($, Backbone, PostType, Settings) {
  'use strict';
  var PostTypes = Backbone.Collection.extend({
    model: PostType,
    url: Settings.get('api_url') + '/posts/types'
  });

  return PostTypes;
});

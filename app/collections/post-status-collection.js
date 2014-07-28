/* global define */

define([
  'jquery',
  'backbone',
  'models/post-status-model',
  'models/settings-model'
], function ($, Backbone, PostStatus, Settings) {
  'use strict';
  var PostStatuses = Backbone.Collection.extend({
    model: PostStatus,
    url: Settings.get('apiUrl') + '/posts/statuses'
  });

  return PostStatuses;
});

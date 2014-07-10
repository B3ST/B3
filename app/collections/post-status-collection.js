define([
  'jquery',
  'backbone',
  'models/post-status-model',
  'models/settings-model'
], function ($, Backbone, PostStatus, Settings) {
  var PostStatuses = Backbone.Collection.extend({
    model: PostStatus,
    url: Settings.get('url') + '/posts/statuses'
  });

  return PostStatuses;
});
define([
  'jquery',
  'backbone',
  'models/post-status-model'
], function ($, Backbone, PostStatus) {
  var PostStatuses = Backbone.Collection.extend({
    model: PostStatus
  });

  return PostStatuses;
});
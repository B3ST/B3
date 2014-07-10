define([
  'jquery',
  'backbone',
  'models/post-type-model',
  'models/settings-model'
], function ($, Backbone, PostType, Settings) {
  var PostTypes = Backbone.Collection.extend({
    model: PostType,
    url: Settings.get('url') + '/posts/types'
  });

  return PostTypes;
});
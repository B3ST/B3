define([
  'jquery',
  'backbone',
  'models/media-model',
  'models/settings-model'
], function ($, Backbone, Media, Settings) {
  var Medias = Backbone.Collection.extend({
    model: Media,
    url: Settings.get('apiUrl') + '/media'
  });

  return Medias;
});

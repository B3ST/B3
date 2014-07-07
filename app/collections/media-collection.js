define([
  'jquery',
  'backbone',
  'models/media-model'
], function ($, Backbone, Media) {
  var Medias = Backbone.Collection.extend({
    model: Media
  });

  return Medias;
});
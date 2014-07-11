define([
  'jquery',
  'backbone'
], function ($, Backbone) {
  var Settings = Backbone.Model.extend({});
  return new Settings(WP_API_SETTINGS);
});
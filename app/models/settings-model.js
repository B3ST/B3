define([
  'jquery',
  'backbone'
], function ($, Backbone) {
  var Settings = Backbone.Model.extend({
    defaults: {
      url   : WP_API_SETTINGS.url,
      nonce : WP_API_SETTINGS.nonce,
      name  : WP_API_SETTINGS.name
    }
  });

  return new Settings();
});

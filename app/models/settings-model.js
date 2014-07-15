define([
  'jquery',
  'backbone'
], function ($, Backbone) {
  var Settings = Backbone.Model.extend({
    defaults: {
      url   : WP_API_SETTINGS.url,
      nonce : WP_API_SETTINGS.nonce,
      name  : WP_API_SETTINGS.name,
      root  : WP_API_SETTINGS.root,
      path  : WP_API_SETTINGS.path
    }
  });

  return new Settings();
});

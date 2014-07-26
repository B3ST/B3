'use strict';

define([
  'jquery',
  'backbone'
], function ($, Backbone) {
  var Settings = Backbone.Model.extend({
    defaults: {
      name:     WP_API_SETTINGS.name,
      url:      WP_API_SETTINGS.url,
      path:     WP_API_SETTINGS.path,
      apiUrl:   WP_API_SETTINGS.apiUrl,
      themeUrl: WP_API_SETTINGS.themeUrl,
      nonce:    WP_API_SETTINGS.nonce,
      routes:   WP_API_SETTINGS.routes
    }
  });

  return new Settings();
});

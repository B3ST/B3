/* global define, WP_API_SETTINGS */

define([
  'jquery',
  'underscore',
  'backbone'
], function ($, _, Backbone) {
  'use strict';

  var Settings = Backbone.Model.extend({
    defaults: {
      name:      WP_API_SETTINGS.name,
      site_url:  WP_API_SETTINGS.site_url,
      site_path: WP_API_SETTINGS.site_path,
      api_url:   WP_API_SETTINGS.api_url,
      nonce:     WP_API_SETTINGS.nonce,
      routes:    WP_API_SETTINGS.routes
    },

    url: function () {
      return this.attributes.api_url + '/b3:settings';
    }
  });

  Settings.prototype.get = function (attr) {
    var field = this.attributes[attr];
    if (_.isObject(field) && field.value) {
      return field.value;
    } else {
      return field;
    }
  };

  return new Settings();
});

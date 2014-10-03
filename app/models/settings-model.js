/* global define, WP_API_SETTINGS */

define([
  'underscore',
  'backbone'
], function (_, Backbone) {
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
    },

    getRoutes: function (methodNames) {
      var routes    = this.get('routes'),
          fragments = _.keys(routes),
          appRoutes = {};

      _.each(fragments, function (fragment) {
        var route = routes[fragment];
        if (methodNames.hasOwnProperty(route.object)) {
          var methods = methodNames[route.object],
              method = methods[route.type] || methods['default'];
          appRoutes[fragment] = method;
        }
      });

      return appRoutes;
    }
  });

  Settings.prototype.get = function (attr) {
    var field = this.attributes[attr];
    if (_.isObject(field) && !_.isUndefined(field.value)) {
      return field.value;
    } else {
      return field;
    }
  };

  return new Settings();
});

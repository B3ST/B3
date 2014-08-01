/* global define */

define([
  'jquery',
  'underscore',
  'backbone',
  'models/user-model',
  'models/settings-model'
], function ($, _, Backbone, User, Settings) {
  'use strict';

  var parseableDates = ['date', 'modified', 'date_gmt', 'modified_gmt'];
  var defaultRoutes = {
    ""                      : "showHome",
    "post/:slug/page/:page" : "showPostBySlug",
    "post/:slug"            : "showPostBySlug",
    "post/:id"              : "showPostById",
    "post?*queryString"     : "showSearch",
    "*slug"                 : "showPageBySlug"
  };

  var defaultMethods = {
    'author'  : 'showPostByAuthor',
    'tag'     : 'showPostByTag',
    'category': 'showPostByCategory',
    'page'    : 'showArchive'
  };

  var Rewrite = {
    toJSON: function() {
      var attributes = _.clone(this.attributes);

      _.each(parseableDates, function(key) {
        if (key in attributes) {
          attributes[key] = attributes[key].toISOString();
        }
      });

      if (this.get('author')) {
        attributes.author = this.get('author').attributes;
      }

      return attributes;
    },

    parse: function(response) {
      _.each(parseableDates, function(key) {
        if (response.hasOwnProperty(key)) {
          var timestamp = Date.parse(response[key]);
          response[key] = new Date(timestamp);
        }
      });

      if (response.author) {
        response.author = new User(response.author);
      }

      return response;
    },

    sync: function(method, model, options) {
      options = options || {};

      var beforeSend = options.beforeSend;
      options.beforeSend = function(xhr) {
        xhr.setRequestHeader('X-WP-Nonce', Settings.get('nonce'));

        if (beforeSend) {
          return beforeSend.apply(this, arguments);
        }
      };

      return Backbone.sync(method, model, options);
    },

    processAppRoutes: function (controllers, appRoutes) {
      var routes = _.extend(this._getWpRoutes(), defaultRoutes);

      if (appRoutes) {
        routes = _.extend(routes, appRoutes);
      }

      console.log(routes);
      var routeNames = _.keys(appRoutes).reverse(); // Backbone requires reverted order of routes

      _.each(routeNames, function(route) {
        this._addAppRoute(controllers, route, appRoutes[route]);
      }, this);
    },

    //var parameters = route.match(/(:\w*)/g);
    //console.log(parameters);
    _getWpRoutes: function () {
      var routes  = Settings.get('routes'),
          keys    = _.keys(routes),
          methods = {};

      _.each(keys, function (key) {
        var route = routes[key];
        if (defaultMethods.hasOwnProperty(key)) {
          var method = defaultMethods[key];
          methods[route] = method;
          methods[route + '/page/:page'] = method;
        }
      });

      return methods;
    }
  };

  return Rewrite;
});
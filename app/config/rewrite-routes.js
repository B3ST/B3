/* global define */

define([
  'jquery',
  'underscore',
  'backbone',
  'models/settings-model'
], function ($, _, Backbone, Settings) {
  'use strict';

  var methodNames = {
    'root'    : 'showHome',
    'post'    : 'showPostBySlug',
    'page'    : 'showPageBySlug',
    'author'  : 'showPostByAuthor',
    'post_tag': 'showPostByTag',
    'category': 'showPostByCategory',
    'search'  : 'showSearch'
    // 'attachment'
    // 'date'
    // 'post_format'
  };

  function getWordPressRoutes () {
    var routes    = Settings.get('routes'),
        fragments = _.keys(routes),
        methods   = {};

    _.each(fragments, function (fragment) {
      var route = routes[fragment];
      if (methodNames.hasOwnProperty(route.type)) {
        var method = methodNames[route.type];
        methods[fragment] = method;
      }
    });

    return methods;
  }

  var RewriteRoutes = {
    processAppRoutes: function (controllers, appRoutes) {
      var routes = getWordPressRoutes();

      if (appRoutes) {
        appRoutes = _.extend(routes, appRoutes);
      }

      var routeNames = _.keys(appRoutes).reverse(); // Backbone requires reverted order of routes

      this.appParams = {};
      _.each(routeNames, function(route) {
        var controller = _.find(controllers, function (controller) {
          return controller[routes[route]] ? true : false;
        });

        this.appParams[this._routeToRegExp(route)] = route.match(/:([^\/:()*]+)/g);
        this._addAppRoute(controller, route, routes[route]);
      }, this);

      this.appRoutes = appRoutes;
    },

    extractParameters: function (route, fragment) {
      var params = route.exec(fragment).slice(1),
          paramsObj = {};

      _.each(this.appParams[route], function (key, index) {
        paramsObj[key.replace(':', '')] = params[index] ? params[index] : null;
      });

      return [paramsObj];
    }
  };

  return RewriteRoutes;
});
/* global define */

define([
  'underscore',
  'backbone',
  'marionette',
  'models/settings-model'
], function (_, Backbone, Marionette, Settings) {
  'use strict';

  var methodNames = {
    'archive': {
      'root':   'showHome',
      'date':   'showPostByDate',
      'search': 'showSearch'
    },
    'post': {
      'post':       'showPostBySlug',
      'page':       'showPageBySlug',
      'attachment': '',
      'default':    'showPostTypeBySlug'
    },
    'taxonomy': {
      'category': 'showPostByCategory',
      'post_tag': 'showPostByTag',
      'default' : 'showPostByTaxonomy'
    },
    'author'  : {
      'author': 'showPostByAuthor',
    }
  };

  Backbone.Router.prototype._extractParameters = function (route, fragment) {
    var params = route.exec(fragment).slice(1),
        paramsObj = {};

    _.each(this.appParams[route], function (key, index) {
      paramsObj[key.replace(/[:*$]/, '')] = params[index] ? params[index] : null;
    });

    return [paramsObj];
  };

  // We changed the way the Backbone router captures URL parameters:
  // - Support for the `-` and `_` characters in `:named` and `*splat` parameters.
  // - Support for named regex parameters (in the `$name<regex>` form.)
  // - Disabled regexp escaping to allow named regex parameters.
  Backbone.Router.prototype._routeToRegExp = function (route) {
    var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]+/g,
        optionalParam = /\((.*?)\)/g,
        namedParam    = /(\(\?)?:[\w\-_\\]+/g,
        splatParam    = /\*[\w\-_\\]+/g,
        regexpParam   = /\$([\w\-_\\]+)\<([^>]+)\>/g;

    route = route//.replace(escapeRegExp, '\\$&')
                 .replace(optionalParam, '(?:$1)?')
                 .replace(namedParam, function(match, optional) {
                    return optional ? match : '([^/?]+)';
                  })
                 .replace(splatParam, '([^?]*?)')
                 .replace(regexpParam, '($2)');

    return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
  };

  /**
   * Internal method to process the `appRoutes` for the
   * router, and turn them in to routes that trigger the
   * specified method on the specified `controller`.
   *
   * @param  {Array}  controllers [description]
   * @param  {[type]} appRoutes   [description]
   * @return {[type]}             [description]
   */
  Marionette.AppRouter.prototype.processAppRoutes = function (controllers, appRoutes) {
    var routes = Settings.getRoutes(methodNames),
        routeNames;

    if (appRoutes) {
      appRoutes = _.extend(routes, appRoutes);
    }

    routeNames = _.keys(appRoutes).reverse(); // Backbone requires reverted order of routes

    this.appParams = {};

    _.each(routeNames, function(route) {
      var controller = _.find(controllers, function (controller) {
        return controller[routes[route]];
      });

      this.appParams[this._routeToRegExp(route)] = route.match(/([:*$]([^\/:()*<]+))/g);

      this._addAppRoute(controller, route, routes[route]);
    }, this);

    this.appRoutes = appRoutes;
  };
});

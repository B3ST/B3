/* global define */

define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'models/settings-model'
], function ($, _, Backbone, Marionette, Settings) {
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
      paramsObj[key.replace(':', '').replace('*', '')] = params[index] ? params[index] : null;
    });

    return [paramsObj];
  };

  // Nothing was changed, except for the namedParams and the splatParam.
  // The Backbone regex  did not capture named params like :some-thing or *some-thing
  // because this regex does not include non-word characters like - or _.
  // With the new regex, we capture word characters, - and _.
  Backbone.Router.prototype._routeToRegExp = function (route) {
    var optionalParam = /\((.*?)\)/g,
        namedParam    = /(\(\?)?:[\w\-\_\\]+/g,
        splatParam    = /\*[\w\-\_\\]+/g,
        escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;


    route = route.replace(escapeRegExp, '\\$&')
                 .replace(optionalParam, '(?:$1)?')
                 .replace(namedParam, function(match, optional) {
                    return optional ? match : '([^/?]+)';
                  })
                 .replace(splatParam, '([^?]*?)');
    return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
  };

  Marionette.AppRouter.prototype.processAppRoutes = function (controllers, appRoutes) {
    var routes = Settings.getRoutes(methodNames);

    if (appRoutes) {
      appRoutes = _.extend(routes, appRoutes);
    }

    var routeNames = _.keys(appRoutes).reverse(); // Backbone requires reverted order of routes

    this.appParams = {};
    _.each(routeNames, function(route) {
      var controller = _.find(controllers, function (controller) {
        return controller[routes[route]] ? true : false;
      });

      this.appParams[this._routeToRegExp(route)] = route.match(/(:([^\/:()*]+)|(\*([^\/:()*]+)))/g);
      this._addAppRoute(controller, route, routes[route]);
    }, this);

    this.appRoutes = appRoutes;
  };
});
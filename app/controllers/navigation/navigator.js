/* globals define */

define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'controllers/bus/event-bus',
  'models/settings-model'
], function ($, _, Backbone, Marionette, EventBus, Settings) {
  'use strict';

  var schema = {
    'url':   function (page) {
      return 'page/' + page;
    },
    'query': function (page) {
      return '&page=' + page;
    }
  };

  function routeIsPaged (route) {
    var isPaged = route.match(/(page\/\d)|(page=\d)/);
    return isPaged !== null && isPaged.length > 0;
  }

  function buildUri(route, replace) {
    var pageRegex   = /(\(.*\))/g,
        pageSection = route.match(pageRegex)[0];

    if (!replace.paged) {
      route = route.replace(pageSection, '');
      delete replace.paged;
    } else {
      var pageSectionContentRegex = new RegExp(pageSection, 'g'),
          pageSectionContent = pageSection.match(pageSectionContentRegex);

      route = route.replace(pageSection, pageSectionContent);
    }

    return route.supplant(replace);
  }

  function getCurlyKey (key) {
    var attrs = key.match(/(:[^\/:()*]+)/g);
    _.each(attrs, function (attr) {
      key = key.replace(attr, '{' + attr.replace(':', '') + '}');
    });

    return key;
  }

  var Navigator = Backbone.Model.extend({
    initialize: function () {
      this.routes = this.processRoutes(Settings.get('routes'));
    },

    processRoutes: function (routes) {
      var keys    = _.keys(routes),
          mapping = {};

      _.each(keys, function (key) {
        var route = routes[key];
        if (!mapping.hasOwnProperty(route.type)) {
          mapping[route.type] = [];
        }

        mapping[route.type].push(getCurlyKey(key));
      });

      return mapping;
    },

    navigate: function (route, trigger) {
      EventBus.trigger('router:nav', {route: route, options: {trigger: trigger}});
    },

    navigateToHome: function (home, page, trigger) {
      this.navigateToType(this.routes.root, {paged: page}, trigger);
    },

    navigateToPost: function (post, page, trigger) {
      this.navigateToType(this.routes.post, {post: post, paged: page}, trigger);
    },

    navigateToPage: function (page, paged, trigger) {
      this.navigateToType(this.routes.page, {page: page, paged: paged}, trigger);
    },

    navigateToAuthor: function (author, paged, trigger) {
      this.navigateToType(this.routes.author, {author: author, paged: paged}, trigger);
    },

    navigateToCategory: function (category, paged, trigger) {
      this.navigateToType(this.routes.category, {category: category, paged: paged}, trigger);
    },

    navigateToTag: function (tag, paged, trigger) {
      this.navigateToType(this.routes.post_tag, {post_tag: tag, paged: paged}, trigger);
    },

    navigateToType: function (type, data, trigger) {
      var route = buildUri(type[0], data);
      this.navigate(route, trigger);
    },

    getRoute: function () {
      return Backbone.history.fragment;
    },

    getPagedRoute: function (filter, page) {
      var url   = schema[filter.get('paging-schema')],
          regex = /(page\/\d)|(&page=\d)/,
          route = this.getRoute();

      route = (routeIsPaged(route)) ? route.replace(regex, url(page))
                                    : route + '/' + url(page);
      return route;
    }
  });

  return new Navigator();
});

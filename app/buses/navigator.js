/* globals define */

define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'buses/event-bus',
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
    var isPaged = route.match(/(page\/\d+\/?$)|([?&]page=\d+)/);
    return isPaged !== null && isPaged.length > 0;
  }

  function buildUri(route, replace) {
    var pageRegex   = /(\(\/?page\/.*\))/g;
    var pageSection = route.match(pageRegex);

    pageSection = (_.isEmpty(pageSection)) ? '' : pageSection[0];

    if (!replace.paged || replace.paged < 2) {
      route = route.replace(pageSection, '');
      delete replace.paged;
    } else {
      var pageSectionContentRegex = new RegExp(pageSection, 'g');
      var pageSectionContent      = pageSection.match(pageSectionContentRegex);

      route = route.replace(pageSection, pageSectionContent);
    }

    return route.supplant(replace);
  }

  function getCurlyKey (key) {
    var attrs = key.match(/([:*]([^\/:()*]+))/g);
    _.each(attrs, function (attr) {
      key = key.replace(attr, '{' + attr.replace(/(:)|(\*)/g, '') + '}');
    });

    return key;
  }

  var Navigator = Backbone.Model.extend({
    initialize: function () {
      this.routes = this._processRoutes(Settings.get('routes'));
    },

    navigateToCurrent: function () {
      Backbone.history.loadUrl();
    },

    navigate: function (route, trigger) {
      route = this._routeFromAbsoluteUrl(route);
      EventBus.trigger('router:nav', {route: route, options: {trigger: trigger}});
    },

    navigateToHome: function (home, paged, trigger) {
      this._navigateToType(this.routes.root[0], {paged: paged}, trigger);
    },

    navigateToSearch: function (search, paged, trigger) {
      this._navigateToType(this.routes.search[0], {search: search, paged: paged}, trigger);
    },

    navigateToAuthor: function (author, paged, trigger) {
      this._navigateToType(this.routes.author[0], {author: author, paged: paged}, trigger);
    },

    navigateToDate: function (date, paged, trigger) {
      var numValues = _.keys(date).length;
      this._navigateToType(this.routes.date[numValues - 1], _.extend(date, {paged: paged}), trigger);
    },

    navigateToPost: function (post, paged, trigger) {
      var routeParams = _.extend({}, { paged: paged, post: post.get('slug') }, post.getFormattedDate());
      this._navigateToType(this.routes.post[0], routeParams, trigger);
    },

    navigateToPage: function (page, paged, trigger) {
      this.navigateToPostType('page', page, paged, trigger);
    },

    navigateToPostType: function (type, post, paged, trigger) {
      var routeParams = {paged: paged};
      routeParams[type] = post;
      this._navigateToType(this.routes[type][0], routeParams, trigger);
    },

    navigateToTaxonomy: function (taxonomy, term, paged, trigger) {
      var routeParams = {paged: paged};
      routeParams[taxonomy] = term;
      this._navigateToType(this.routes[taxonomy][0], routeParams, trigger);
    },

    getRouteOfType: function (type, slug, paged) {
      var data   = {};
      data[type] = slug;
      data.paged = paged;
      return buildUri(this.routes[type][0], data);
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
    },

    /**
     * Extract route string from an absolute URL.
     * @param  {String} url Absolute or relative URL.
     * @return {String}     Route.
     */
    _routeFromAbsoluteUrl: function (url) {
      if (Settings.get('site_url') + '/' === url) {
        return '';
      }

      var re = new RegExp('^' + Settings.get('site_url') + '/(.+?)/?$', 'g');
      return url.replace(re, '$1');
    },

    _navigateToType: function (type, data, trigger) {
      var route = buildUri(type, data);
      this.navigate(route, trigger);
    },

    _processRoutes: function (routes) {
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
  });

  return new Navigator();
});

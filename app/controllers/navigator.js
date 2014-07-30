/* globals define */

define([
  'jquery',
  'backbone',
  'marionette',
  'controllers/event-bus'
], function ($, Backbone, Marionette, EventBus) {
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

  var Navigator = Backbone.Model.extend({
    navigate: function (route, trigger) {
      EventBus.trigger('router:nav', {route: route, options: {trigger: trigger}});
    },

    getRoute: function () {
      return Backbone.history.fragment;
    },

    getPagedRoute: function (filter, page) {
      var url   = schema[filter.get('paging-schema')],
          regex = /(page\/\d)|(&page=\d)/,
          route = this.getRoute();

      route = (routeIsPaged(route)) ? route.replace(regex, url(page))
                                    : route + url(page);
      return route;
    }
  });

  return new Navigator();
});

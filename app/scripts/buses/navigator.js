/* globals define */

define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'buses/event-bus',
  'models/settings-model',
  'config/routes'
], function ($, _, Backbone, Marionette, EventBus, Settings, Routes) {
  'use strict';

  var Navigator = Backbone.Model.extend({
    initialize: function () {
      this.routes = Routes.processRoutes(Settings.get('routes'));
    },

    getAuthorLink: function (author) {
      return Routes.buildUri(this.routes.author[0], { author: author });
    },

    navigateToCurrent: function () {
      Backbone.history.loadUrl();
    },

    navigate: function (route, trigger) {
      route = Routes.routeFromAbsoluteUrl(route);
      EventBus.trigger('router:nav', {route: route, options: {trigger: trigger}});
    },

    navigateToLink: function (route, trigger) {
      if (route.startsWith(Settings.get('site_url'))) {
        this.navigate(route, trigger);
      } else {
        window.open(route);
      }
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

    _navigateToType: function (type, data, trigger) {
      var route = Routes.buildUri(type, data);
      this.navigate(route, trigger);
    }
  });

  return new Navigator();
});

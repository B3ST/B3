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

    _navigateToType: function (type, data, trigger) {
      var route = Routes.buildUri(type, data);
      this.navigate(route, trigger);
    }
  });

  return new Navigator();
});

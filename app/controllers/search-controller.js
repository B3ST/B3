/* global define */

define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'controllers/base-controller',
  'collections/post-collection',
  'helpers/post-filter',
  'buses/event-bus',
  'controllers/navigation/navigator'
], function ($, _, Backbone, Marionette, BaseController, Posts, PostFilter, EventBus, Navigator) {
  'use strict';

  return BaseController.extend({
    postInitialize: function() {
      this._bindToEvents();
    },

    _bindToEvents: function () {
      _.bindAll(this, 'searchStart', 'showSearchResults', 'displaySearchUrl', 'searchStop');
      EventBus.bind('search:view:start', this.searchStart);
      EventBus.bind('search:view:term', this.showSearchResults);
      EventBus.bind('search:view:submit', this.displaySearchUrl);
      EventBus.bind('search:view:stop', this.searchStop);
    },

    /**
     * Warn other controllers that the user is starting search
     */
    searchStart: function () {
      EventBus.trigger('search:start');
      this._displayLoading();
    },

    /**
     * Warn about the results of a given search
     *
     * @param  {Object} options The search terms
     */
    showSearchResults: function (options) {
      var page   = options.page || 1,
          filter = new PostFilter();

      filter.bySearchingFor(options.s).onPage(page);

      this._displayLoading();
      this.posts.fetch(this._fetchParams(filter))
                 .done(function () { EventBus.trigger('search:results:found', {results: this.posts, filter: filter}); }.bind(this))
                 .fail(function () { EventBus.trigger('search:results:not_found'); }.bind(this));
    },

    /**
     * Displays the search url with the corresponding search term
     *
     * @param  {Object} options Object containing the search term s
     */
    displaySearchUrl: function (options) {
      Navigator.navigateToSearch(options.s, null, false);
    },

    /**
     * Get the search results
     *
     * @param {String} query The query string
     */
    showSearch: function (params) {
      this.showSearchResults({s: params.search, page: params.paged});
    },

    /**
     * Warn other controllers that the search has stopped
     */
    searchStop: function () {
      EventBus.trigger('search:stop');
    },

    /**
     * Return the fetch parameters for a collection
     * @param  {PostFilter} filter The filters to use in the fetching
     * @return {Object}            The parameters to be used in the collection
     */
    _fetchParams: function (filter) {
      return { reset: true, data: filter.serialize() };
    },

    /**
     * Displays the loading view in the main region
     */
    _displayLoading: function () {
      this.showLoading({region: this.app.main});
    }
  });
});
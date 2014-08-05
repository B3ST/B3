/* global define */

define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'controllers/base-controller',
  'collections/post-collection',
  'helpers/post-filter',
  'controllers/bus/event-bus'
], function ($, _, Backbone, Marionette, BaseController, Posts, PostFilter, EventBus) {
  'use strict';

  return BaseController.extend({
    postInitialize: function() {
      this.bindToEvents();
    },

    bindToEvents: function () {
      _.bindAll(this, 'showEmptySearchView', 'showSearchResults', 'showPreviousView');
      EventBus.bind('search:start', this.showEmptySearchView);
      EventBus.bind('search:term', this.showSearchResults);
      EventBus.bind('search:end', this.showPreviousView);
    },

    /**
     * Display the results of a search
     *
     * @param {String} query The query string
     */
    showSearch: function (query) {
      this.showSearchResults(this._getParams(query));
      this.showLoading();
    },

    /**
     * Displays a blank page when the user is searching
     */
    showEmptySearchView: function () {
      if (!this.showingEmpty) {
        this.previousView    = this.app.main.currentView;
        this.previousOptions = this.app.main.currentView.options;
        this.showingEmpty    = true;
        this.show(this.emptyView());
      }
    },

    /**
     * Displays the results of a given search
     *
     * @param  {Object} options The search terms
     */
    showSearchResults: function (options) {
      var page   = options.page || 1,
          filter = new PostFilter();

      filter.bySearchingFor(options.s).onPage(page);

      this.posts.fetch(this._fetchParams(filter))
                 .done(function () { this.show(this.archiveView(this.posts, page, filter)); }.bind(this))
                 .fail(function () { this.show(this.notFoundView()); }.bind(this));
    },

    /**
     * Displays the previous view
     */
    showPreviousView: function () {
      this.currentView  = this.previousView;
      this.showingEmpty = false;
      this.show(new this.previousView.constructor(this.previousOptions));
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
     * Parse query parameters
     * @param  {string} queryString The query string from the URL
     * @return {Object}             An objectified query
     */
    _getParams: function (queryString) {
      var result = {};
      var regex  = new RegExp("([^?=&]+)(=([^&]*))?", "g");

      queryString.replace(regex, function (q1, q2, q3, q4) {
        result[q2] = (isNaN(this._filterInt(q4)) ? q4 : parseInt(q4, 10));
      }.bind(this));

      return result;
    },

    /**
     * Check if value is a number and return it
     * @param  {string} value   The value to check
     * @return {Number or NaN}  Returns the number in value or NaN
     */
    _filterInt: function (value) {
      return (/^(\-|\+)?([0-9]+|Infinity)$/.test(value)) ? Number(value): NaN;
    }
  });
});
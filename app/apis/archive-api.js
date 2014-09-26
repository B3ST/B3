/* global define */

define([
  'backbone',
  'marionette',
  'controllers/archive-controller',
  'buses/event-bus',
  'models/settings-model',
  'helpers/post-filter'
], function (Backbone, Marionette, ArchiveController, EventBus, Settings, PostFilter) {
  'use strict';

  var ArchiveAPI = Backbone.Marionette.Controller.extend({
    showHome: function (params) {
      var onFront = Settings.get('page_on_front');
      if (onFront > 0) {
        EventBus.trigger('page:show', {page: onFront});
      } else {
        this.showArchive(params);
      }
    },

    showArchive: function (params) {
      var page   = this._getPage(params),
          filter = new PostFilter().onPage(page);

      this._showArchive(page, filter);
    },

    showPostByCategory: function (params) {
      var page   = this._getPage(params),
          catg   = params.category,
          filter = new PostFilter().byCategory(catg).onPage(page);

      this._showArchive(page, filter);
    },

    showPostByTag: function (params) {
      var page   = this._getPage(params),
          ptag   = params.post_tag,
          filter = new PostFilter().byTag(ptag).onPage(page);

      this._showArchive(page, filter);
    },

    showPostByAuthor: function (params) {
      var page   = this._getPage(params),
          author = params.author,
          filter = new PostFilter().byAuthor(author).onPage(page);

      this._showArchive(page, filter);
    },

    showPostByDate: function (params) {
      var page   = this._getPage(params),
          filter = this._getDateFilter(params).onPage(page);

      this._showArchive(page, filter);
    },

    showCustomTaxonomy: function  () {

    },

    _showArchive: function (page, filter) {
      new ArchiveController({ page: page, filter: filter }).showArchive();
    },

    _getPage: function (params) {
      return parseInt(params.paged, 10) || 1;
    },

    _getDateFilter: function (params) {
      var filter = new PostFilter();

      if (params.hasOwnProperty('year')) { filter.withYear(params.year); }
      if (params.hasOwnProperty('monthnum')) { filter.withMonth(params.monthnum); }
      if (params.hasOwnProperty('day')) { filter.withDay(params.day); }

      return filter;
    }
  });

  return ArchiveAPI;
});
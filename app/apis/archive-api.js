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
    initialize: function () {
      EventBus.on('archive:show', this.showArchive, this);
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
          filter = new PostFilter().withDate(params).onPage(page);

      this._showArchive(page, filter);
    },

    showPostByTaxonomy: function  () {

    },

    _showArchive: function (page, filter) {
      new ArchiveController({ page: page, filter: filter }).showArchive();
    },

    _getPage: function (params) {
      return parseInt(params.paged, 10) || 1;
    }
  });

  return ArchiveAPI;
});
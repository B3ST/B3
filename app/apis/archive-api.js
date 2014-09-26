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
      var page   = parseInt(params.paged, 10) || 1,
          filter = new PostFilter().onPage(page);

      this._showArchive(page, filter);
    },

    showPostByCategory: function (params) {
      var page   = parseInt(params.paged, 10) || 1,
          catg   = params.category,
          filter = new PostFilter().byCategory(catg).onPage(page);

      this._showArchive(page, filter);
    },

    showPostByTag: function (params) {
      var page   = parseInt(params.paged, 10) || 1,
          ptag   = params.post_tag,
          filter = new PostFilter().byTag(ptag).onPage(page);

      this._showArchive(page, filter);
    },

    showPostByAuthor: function (params) {
      var page   = parseInt(params.paged, 10) || 1,
          author = params.author,
          filter = new PostFilter().byAuthor(author).onPage(page);

      this._showArchive(page, filter);
    },

    showPostByDate: function () {

    },

    showCustomTaxonomy: function  () {

    },

    _showArchive: function (page, filter) {
      new ArchiveController({ page: page, filter: filter }).showArchive();
    }
  });

  return ArchiveAPI;
});
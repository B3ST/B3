/* global define */

define([
  'backbone',
  'marionette',
  'controllers/archive-controller',
  'helpers/post-filter'
], function (Backbone, Marionette, ArchiveController, PostFilter) {
  'use strict';

  var ArchiveAPI = Backbone.Marionette.Controller.extend({
    initialize: function (options) {
      this.page   = options.page || 1;
      this.filter = options.filter || new PostFilter();
    },

    showHome: function (params) {
      this.showArchive(params || {});
    },

    showArchive: function (params) {
      this.taxonomy = null;
      this.page     = params.paged || 1;
      this.filter   = new PostFilter();

      new ArchiveController({ page: this.page, filter: this.filter }).showArchive();
    },

    showPostByCategory: function () {

    },

    showPostByTag: function () {

    },

    showPostByAuthor: function  () {

    },

    showPostByDate: function () {

    },

    showCustomTaxonomy: function  () {

    }
  });

  return ArchiveAPI;
});
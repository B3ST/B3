/* global define */

define([
  'controllers/base-controller',
  'controllers/archive-controller',
  'views/search-view',
  'collections/post-collection',
  'helpers/post-filter',
  'buses/navigator'
], function (BaseController, ArchiveController, SearchView, Posts, PostFilter, Navigator) {
  'use strict';

  var SearchController = BaseController.extend({
    busEvents: {
      'search:view:search:term':   'searchTerm',
      'search:view:search:submit': 'navigateSearchUrl',
      'search:view:search:empty':  'teardownSearch'
    },

    initialize: function (options) {
      options     = options || {};
      this.filter = options.filter || new PostFilter();
      this.posts  = options.posts || new Posts(null, { filter: this.filter });
    },

    showSearch: function (options) {
      this.show(new SearchView(), { region: options.region });
    },

    onBeforeDestroy: function () {
      this.archive.mainView.destroy();
    },

    searchTerm: function (options) {
      this.filter.bySearchingFor(options.search);
      if (this.posts.length > 0) {
        this.archiveController().triggerMethod('search:term');
      } else {
        this.archiveController().showArchive();
      }
    },

    navigateSearchUrl: function (options) {
      var page = null, trigger = false;
      Navigator.navigateToSearch(options.search, page, trigger);
    },

    teardownSearch: function () {
      this.posts.reset();
      Navigator.navigateToCurrent();
    },

    archiveController: function () {
      if (!this.archive) {
        this.archive = new ArchiveController({ posts: this.posts, filter: this.filter });
      }

      return this.archive;
    }
  });

  return SearchController;
});
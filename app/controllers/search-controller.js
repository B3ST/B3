/* global define */

define([
  'controllers/base-controller',
  'controllers/archive-controller',
  'views/search-view',
  'collections/post-collection',
  'helpers/post-filter',
  'buses/command-bus',
  'buses/navigator'
], function (BaseController, ArchiveController, SearchView, Posts, PostFilter, CommandBus, Navigator) {
  'use strict';

  var SearchController = BaseController.extend({
    busEvents: {
      'search:lookup': 'searchTerm',
      'search:submit': 'navigateSearchUrl',
      'search:reset':  'teardownSearch'
    },

    initialize: function (options) {
      options     = options || {};
      this.filter = options.filter || new PostFilter();
      this.posts  = options.posts || new Posts(null, { filter: this.filter });
      this._handleCommands();
    },

    showSearch: function (options) {
      this.show(new SearchView(), { region: options.region });
    },

    onBeforeDestroy: function () {
      if (this.archive) {
        this.archive.mainView.destroy();
      }
    },

    searchTerm: function (options) {
      var page = options.paged || 1;

      this.filter.bySearchingFor(options.search).onPage(page);
      if (this.posts.length > 0) {
        this._archiveController().triggerMethod('search:term');
      } else {
        this._archiveController().showArchive();
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

    _archiveController: function () {
      if (!this.archive) {
        this.archive = new ArchiveController({ posts: this.posts, filter: this.filter });
      }

      return this.archive;
    },

    _handleCommands: function () {
      CommandBus.setHandler('search:term', this.searchTerm, this);
    }
  });

  return SearchController;
});

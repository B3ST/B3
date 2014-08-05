/* global define */

define([
  'jquery',
  'backbone',
  'marionette',
  'helpers/post-filter',
  'controllers/bus/command-bus',
  'views/archive-view',
  'views/empty-view',
  'views/loading-view',
  'views/not-found-view'
], function ($, Backbone, Marionette, PostFilter, CommandBus, ArchiveView, EmptyView, LoadingView, NotFoundView) {
  'use strict';

  function fetchParams (filter) {
    return {
      reset: true,
      data:  filter.serialize(),
    };
  }

  return Marionette.Controller.extend({
    initialize: function(options) {
      this.app     = options.app;
      this.posts   = options.posts;
      this.user    = options.user;

      this.loading = this.loadingView();
    },

    /**
     * Display the home page.
     */
    showHome: function (params) {
      // TODO: Display either a post list or a page according to WordPress'
      // home page settings (full post list vs page ID):

      this.showArchive(params);
    },

    /**
     * Display the home page post archive.
     *
     * @param {int} page Page number.
     */
    showArchive: function (params) {
      var filter = new PostFilter(),
          page   = params.paged || 1;

      filter.onPage(page);

      this.posts.fetch(fetchParams(filter))
                .done(function () { this.hideLoading(); }.bind(this));

      this.show(this.archiveView(this.posts, page, filter));

      this.showLoading();
    },

    /**
     * Display posts of a given category
     *
     * @param  {string} category Category name
     * @param  {int}    page     Page number
     */
    showPostByCategory: function (params) {
      var filter = new PostFilter(),
          category = params.category,
          page     = params.paged;

      filter.byCategory(category);
      this.fetchPostsOfPage(filter, page);
    },

    /**
     * Display posts of a given tag
     *
     * @param  {string} tag  Tag name
     * @param  {int}    page Page number
     */
    showPostByTag: function (params) {
      var filter = new PostFilter(),
          tag    = params.post_tag,
          page   = params.paged;

      filter.byTag(tag);
      this.fetchPostsOfPage(filter, page);
    },

    /**
     * Display posts of a given author
     *
     * @param  {string} author Author name
     * @param  {int}    page   Page number
     */
    showPostByAuthor: function (params) {
      var filter = new PostFilter(),
          author = params.author,
          page   = params.paged;

      filter.byAuthor(author);
      this.fetchPostsOfPage(filter, page);
    },

        /**
     * Fetch all posts using a set of filters and display the
     * corresponding view on success or fail.
     *
     * @param  {PostFilter} filter The filters used to fetch the posts
     * @param  {int}        page   Page number
     */
    fetchPostsOfPage: function (filter, page) {
      page = page || 1;
      filter.onPage(page);

      this.show(this.archiveView(this.posts, page, filter));
      this.showLoading();
      this.posts.fetch(fetchParams(filter))
          .done(function () { this.hideLoading(); }.bind(this))
          .fail(function () { this.show(this.notFoundView()); }.bind(this));
    },

    /**
     * Display view.
     *
     * @param {Object} view View to display.
     */
    show: function (view) {
      this.app.main.show(view);
    },

    /**
     * Triggers a command to display the loading view
     */
    showLoading: function () {
      CommandBus.execute('loading:show');
    },

    /**
     * Triggers a command to hide the loading view
     */
    hideLoading: function () {
      CommandBus.execute('loading:hide');
    },

    /**
     * Creates a new `NotFoundView` instance.
     *
     * @return {NotFoundView} New "Not found" view instance.
     */
    notFoundView: function () {
      return new NotFoundView();
    },

    /**
     * Creates a new `EmptyView` instance.
     *
     * @return {EmptyView} New "Empty" view instance.
     */
    emptyView: function () {
      return new EmptyView();
    },

    /**
     * Creates a new `LoadingView` instance.
     *
     * @return {LoadingView} New "Loading" view instance.
     */
    loadingView: function () {
      return new LoadingView();
    },

    /**
     * Creates a new ArchiveView instance for a post list.
     *
     * @param  {array}       posts Post collection to display.
     * @param  {int}         page  Page number.
     * @param  {Object}      filter The searching filter
     * @return {ArchiveView}       New archive view instance.
     */
    archiveView: function (posts, page, filter) {
      this.currentView    = ArchiveView;
      this.currentOptions = {collection: posts, page: page, filter: filter};
      return new ArchiveView(this.currentOptions);
    },

  });
});
/* global define */

define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'helpers/post-filter',
  'controllers/base-controller',
  'controllers/bus/event-bus',
  'controllers/navigation/navigator'
], function ($, _, Backbone, Marionette, PostFilter, BaseController, EventBus, Navigator) {
  'use strict';

  return BaseController.extend({
    postInitialize: function (options) {
      this.page   = options.page || 1;
      this.filter = options.filter || new PostFilter();

      _.bindAll(this, 'showPostByCategory', 'showPostByTag', 'showPostByAuthor', 'showPreviousPage', 'showNextPage');
      EventBus.bind('archive:display:category', this.showPostByCategory);
      EventBus.bind('archive:display:tag', this.showPostByTag);
      EventBus.bind('archive:display:author', this.showPostByAuthor);
      EventBus.bind('archive:display:previous:page', this.showPreviousPage);
      EventBus.bind('archive:display:next:page', this.showNextPage);
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
      this.page = params.paged || 1;
      this.filter = new PostFilter();
      this._fetchPostsOfPage(this.page);
    },

    /**
     * Display posts of a given category
     *
     * @param  {string} category Category name
     * @param  {int}    page     Page number
     */
    showPostByCategory: function (params) {
      var category = params.category || params.id,
          slug     = params.category || params.slug;

      this.page   = params.paged || 1;
      this.filter = new PostFilter();
      this.filter = isNaN(category) ? this.filter.byCategory(category)
                                    : this.filter.byCategoryId(category);

      this._fetchPostsOfPage(this.page);
      Navigator.navigateToCategory(slug, this.page, false);
    },

    /**
     * Display posts of a given tag
     *
     * @param  {string} tag  Tag name
     * @param  {int}    page Page number
     */
    showPostByTag: function (params) {
      var tag    = params.post_tag || params.id,
          slug   = params.post_tag || params.slug;

      this.page   = params.paged || 1;
      this.filter = new PostFilter();
      this.filter = isNaN(tag) ? this.filter.byTag(tag)
                               : this.filter.byTagId(tag);

      this._fetchPostsOfPage(this.page);
      Navigator.navigateToTag(slug, this.page, false);
    },

    /**
     * Display posts of a given author
     *
     * @param  {string} author Author name
     * @param  {int}    page   Page number
     */
    showPostByAuthor: function (params) {
      var author = params.author || params.id,
          slug   = params.author || params.slug;

      this.page   = params.paged || 1;
      this.filter = new PostFilter();
      this.filter = isNaN(author) ? this.filter.byAuthor(author)
                                  : this.filter.byAuthorId(author);

      this._fetchPostsOfPage(this.page);
      Navigator.navigateToAuthor(slug, this.page, false);
    },

    /**
     * Display the next page
     */
    showNextPage: function () {
      if (!this._isLastPage()) {
        this.page++;
        this._displayPage(this.page);
      }
    },

    /**
     * Display the previous page
     */
    showPreviousPage: function () {
      if (!this._isFirstPage()) {
        this.page--;
        this._displayPage(this.page);
      }
    },

    /**
     * Display a given page
     */
    _displayPage: function (page) {
      var route = Navigator.getPagedRoute(this.filter, page);
      this._fetchPostsOfPage(page);
      Navigator.navigate(route, false);
    },

    /**
     * Fetch all posts using a set of filters and display the
     * corresponding view on success or fail.
     */
    _fetchPostsOfPage: function (page) {
      this.filter.onPage(page);
      this.showLoading();
      this.posts.fetch(this._fetchParams())
          .done(function () { this.show(this.archiveView(this.posts, page)); }.bind(this))
          .fail(function () { this.show(this.notFoundView()); }.bind(this));
    },

    /**
     * Return the fetch parameters for a collection
     * @param  {PostFilter} filter The filters to use in the fetching
     * @return {Object}            The parameters to be used in the collection
     */
    _fetchParams: function () {
      return { reset: true, data: this.filter.serialize() };
    },

    /**
     * Indicates if it is last page or not
     * @return {boolean} true if it is last page, false otherwise
     */
    _isLastPage: function () {
      return this.posts.length === 0;
    },

    /**
     * Indicates if it is the first page or not
     * @return {boolean} true if it is the first page, false otherwise
     */
    _isFirstPage: function () {
      return this.page === 1;
    }
  });
});
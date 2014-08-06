/* global define */

define([
  'jquery',
  'backbone',
  'marionette',
  'helpers/post-filter',
  'controllers/base-controller',
], function ($, Backbone, Marionette, PostFilter, BaseController) {
  'use strict';

  return BaseController.extend({
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

      this.showLoading();
      this.posts.fetch(this._fetchParams(filter))
                .done(function () { this.show(this.archiveView(this.posts, page, filter)); }.bind(this));
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

      this.showLoading();
      this.posts.fetch(this._fetchParams(filter))
          .done(function () { this.show(this.archiveView(this.posts, page, filter)); }.bind(this))
          .fail(function () { this.show(this.notFoundView()); }.bind(this));
    },

    /**
     * Return the fetch parameters for a collection
     * @param  {PostFilter} filter The filters to use in the fetching
     * @return {Object}            The parameters to be used in the collection
     */
    _fetchParams: function (filter) {
      return { reset: true, data: filter.serialize(), };
    }
  });
});
/* global define */

define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'helpers/post-filter',
  'models/settings-model',
  'collections/post-collection',
  'controllers/base-controller',
  'controllers/bus/event-bus',
  'controllers/bus/request-bus',
  'controllers/navigation/navigator',
  'views/archive-view'
], function ($, _, Backbone, Marionette, PostFilter, Settings, Posts, BaseController, EventBus, RequestBus, Navigator, ArchiveView) {
  'use strict';

  return BaseController.extend({
    postInitialize: function (options) {
      this.page       = options.page || 1;
      this.filter     = options.filter || new PostFilter();
      this.taxonomies = options.taxonomies;
      this.taxTypes   = {};

      this._bindToArchiveEvents();
      this._bindToSearchEvents();
    },

    /**
     * Binds to a set of events
     */
    _bindToArchiveEvents: function () {
      _.bindAll(this, 'showArchive', 'showPostByCategory', 'showPostByTag', 'showPostByAuthor', 'showPreviousPage', 'showNextPage', 'showPage');
      EventBus.bind('archive:show', this.showArchive);
      EventBus.bind('archive:display:category', this.showPostByCategory);
      EventBus.bind('archive:display:tag', this.showPostByTag);
      EventBus.bind('archive:display:author', this.showPostByAuthor);
      EventBus.bind('archive:display:previous:page', this.showPreviousPage);
      EventBus.bind('archive:display:next:page', this.showNextPage);
      EventBus.bind('archive:display:page', this.showPage);
    },

    _bindToSearchEvents: function () {
      _.bindAll(this, 'saveCurrentState', 'loadPreviousState', 'displayResults');
      EventBus.bind('search:start', this.saveCurrentState);
      EventBus.bind('search:stop', this.loadPreviousState);
      EventBus.bind('search:results:found', this.displayResults);
      EventBus.bind('search:results:not_found', this.displayResults);
    },

    /**
     * Display the home page.
     */
    showHome: function (params) {
      var onFront = Settings.get('page_on_front');
      if (onFront > 0) {
        EventBus.trigger('page:show', {page: onFront});
      } else {
        this.showArchive(params);
      }
    },

    /**
     * Display the home page post archive.
     *
     * @param {int} page Page number.
     */
    showArchive: function (params) {
      this.taxonomy = null;
      this.page     = params.paged || 1;
      this.filter   = new PostFilter();
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

      $.when(RequestBus.request('taxonomy:get', {taxonomy: 'category', term: slug}))
       .then(function (taxonomy) {
        this.taxonomy = taxonomy;
        this.page     = params.paged || 1;
        this.filter   = new PostFilter();
        this.filter   = isNaN(category) ? this.filter.byCategory(category)
                                        : this.filter.byCategoryId(category);

        this._fetchPostsOfPage(this.page, this.taxonomy);
        Navigator.navigateToTaxonomy('category', slug, this.page, false);
      }.bind(this));
    },

    /**
     * Display posts of a given tag
     *
     * @param  {string} tag  Tag name
     * @param  {int}    page Page number
     */
    showPostByTag: function (params) {
      var tag      = params.post_tag || params.id,
          slug     = params.post_tag || params.slug;

      $.when(RequestBus.request('taxonomy:get', {taxonomy: 'post_tag', term: slug}))
       .then(function (taxonomy) {
        this.taxonomy = taxonomy;
        this.page     = params.paged || 1;
        this.filter   = new PostFilter();
        this.filter   = isNaN(tag) ? this.filter.byTag(tag)
                                 : this.filter.byTagId(tag);

        this._fetchPostsOfPage(this.page, this.taxonomy);
        Navigator.navigateToTaxonomy('post_tag', slug, this.page, false);
      }.bind(this));
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
        this._displayPage(this.page, this.taxonomy);
      }
    },

    /**
     * Display the previous page
     */
    showPreviousPage: function () {
      if (!this._isFirstPage()) {
        this.page--;
        this._displayPage(this.page, this.taxonomy);
      }
    },

    /**
     * Displays a given page
     * @param  {Object} params Object containing the paged parameter
     */
    showPage: function (params) {
      if (this.page !== params.paged) {
        this.page = params.paged;
        this._displayPage(this.page, this.taxonomy);
      }
    },

    /**
     * Navigates to a given post
     * @param  {Object} params The object containing the post
     */
    onDisplayPost: function (params) {
      var post = this.posts.get(params.post);
      EventBus.trigger('post:show', {post: post});
      Navigator.navigateToPost(post.get('slug'), null, false);
    },

    /**
     * Saves the current state (posts, page and filter)
     */
    saveCurrentState: function () {
      this.state = {
        collection:     this.posts,
        page:           this.page,
        filter:         this.filter,
        was_displaying: this.isDisplaying
      };
    },

    /**
     * Loads the previously saved state
     */
    loadPreviousState: function () {
      if (this.state.was_displaying) {
        this.posts  = this.state.collection;
        this.page   = this.state.page || 1;
        this.filter = this.state.filter;
        this.show(this._archiveView(this.posts, this.page));
      }
    },

    /**
     * Displays the given results
     */
    displayResults: function (params) {
      if (params) {
        this.posts  = params.results;
        this.filter = params.filter;
        this.page   = 1;
        this.show(this._archiveView(this.posts, this.page));
      } else {
        this.show(this.notFoundView());
      }
    },

    /**
     * Display a given page
     */
    _displayPage: function (page, taxonomy) {
      var route = Navigator.getPagedRoute(this.filter, page);
      this._fetchPostsOfPage(page, taxonomy);
      Navigator.navigate(route, false);
    },

    /**
     * Fetch all posts using a set of filters and display the
     * corresponding view on success or fail.
     */
    _fetchPostsOfPage: function (page, taxonomy) {
      var title  = taxonomy ? taxonomy.get('name') : false;

      this.posts = new Posts();
      this.filter.onPage(page);
      this.showLoading({region: this.app.main});
      this.posts.fetch(this._fetchParams())
          .done(function (collection, status, jqXHR) {
            var totalPages = jqXHR.getResponseHeader('X-WP-TotalPages');
            this.show(this._archiveView(this.posts, page, title, totalPages));
          }.bind(this))
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
    },

    /**
     * Creates a new ArchiveView instance for a post list.
     *
     * @param  {array}       posts Post collection to display.
     * @param  {int}         page  Page number.
     * @param  {string}      title The title for the archive
     * @return {ArchiveView}       New archive view instance.
     */
    _archiveView: function (posts, page, title, total) {
      return new ArchiveView({collection: posts, page: page, title: title, total: total});
    }
  });
});

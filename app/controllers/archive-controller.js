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
  'controllers/pagination-controller',
  'buses/event-bus',
  'buses/request-bus',
  'buses/navigator',
  'views/archive-view'
], function ($, _, Backbone, Marionette, PostFilter, Settings, Posts, BaseController, PaginationController, EventBus, RequestBus, Navigator, ArchiveView) {
  'use strict';

  return BaseController.extend({
    busEvents: {
      'archive:show':                  'showArchive',
      'archive:view:display:category': 'showPostByCategory',
      'archive:view:display:tag':      'showPostByTag',
      'archive:view:display:author':   'showPostByAuthor',

      'pagination:previous:page':      'showPage',
      'pagination:next:page':          'showPage',
      'pagination:select:page':        'showPage',

      'search:start':                  'saveCurrentState',
      'search:stop':                   'loadPreviousState',
      'search:results:found':          'displayResults',
      'search:results:not_found':      'displayResults'
    },

    childControllers: {
      pagination: 'paginationController'
    },

    initialize: function (options) {
      this.page   = options.paged || 1;
      this.filter = options.filter || new PostFilter();
      this.posts  = options.posts || new Posts();
      this.loaded = false;
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
    showArchive: function () {
      this.show(this._archiveView(this.posts), {
        loading: {
          done: function (collection, status, jqXHR) {
            var totalPages = parseInt(jqXHR.getResponseHeader('X-WP-TotalPages'), 10);
            if (!this.loaded) {
              this.show(this._archiveView(this.posts), { region: this.region });
              this.pagination.showPagination({ region: this.mainView.pagination, page: this.page, pages: totalPages, include: true });
              this.loaded = true;
            }
          }.bind(this),

          fail: function () {
            this.show(this.notFoundView());
          }.bind(this)
        }
      });
    },

    /**
     * Displays a given page
     * @param  {Object} params Object containing the paged parameter
     */
    showPage: function (options) {
      var route;

      if (this.page !== options.page) {
        this.page = options.page;
        route = Navigator.getPagedRoute(this.filter, this.page);
        this.filter.onPage(this.page);
        this.posts.fetch(this._fetchParams())
                  .done(function () { Navigator.navigate(route, false); })
                  .fail(function () { this.show(this.notFoundView()); }.bind(this));
      }
    },

    /**
     * Display posts of a given category
     *
     * @param  {Object} params Object containing the category name and page number
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
     * @param  {Object} params Object containing the tag name and page number
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
     * @param  {Object} params Object containing the author and page number
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
     * Display posts of a given date
     *
     * @param  {Object} params Object containing the date (year, month and/or day) and page number
     */
    showPostByDate: function (params) {
      this.page   = params.paged || 1;
      this.filter = this._dateFilter(params);

      this._fetchPostsOfPage(this.page);
      params = _.omit(params, 'paged');
      _.each(params, function (value, key) {
        if (!value) {
          delete params[key];
        }
      });
      Navigator.navigateToDate(params, this.page, false);
    },

    /**
     * Display posts of a given taxonomy
     *
     * @param  {Object} params Object containing the taxonomy and page number
     */
    showCustomTaxonomy: function (params) {

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

    paginationController: function () {
      return new PaginationController();
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
      //this.show(this._archiveView(this.posts, this.page, ));
      this.posts.fetch(this._fetchParams())
          .done(function (collection, status, jqXHR) {
            var totalPages = parseInt(jqXHR.getResponseHeader('X-WP-TotalPages'), 10);
            this.show(this._archiveView(this.posts, title));
            this.pagination.showPagination({ region: this.mainView.pagination, page: page, pages: totalPages, include: true });
          }.bind(this))
          .fail(function () { this.show(this.notFoundView()); }.bind(this));
    },

    _dateFilter: function (params) {
      var filter = new PostFilter();

      if (params.hasOwnProperty('year')) { filter.withYear(params.year); }
      if (params.hasOwnProperty('monthnum')) { filter.withMonth(params.monthnum); }
      if (params.hasOwnProperty('day')) { filter.withDay(params.day); }

      return filter;
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
     * Creates a new ArchiveView instance for a post list.
     *
     * @param  {array}       posts Post collection to display.
     * @param  {string}      title The title for the archive
     * @return {ArchiveView}       New archive view instance.
     */
    _archiveView: function (posts, title) {
      return new ArchiveView({collection: posts, title: title});
    }
  });
});

/* global define */

define([
  'controllers/base-controller',
  'controllers/pagination-controller',
  'views/archive-view',
  'helpers/post-filter',
  'collections/post-collection',
  'buses/event-bus',
  'buses/navigator'
], function (BaseController, PaginationController, ArchiveView, PostFilter, Posts, EventBus, Navigator) {
  'use strict';

  var ArchiveController = BaseController.extend({
    busEvents: {
      'archive:show':                  'showArchive',

      'archive:view:display:post':     'showPost',
      'archive:view:display:category': 'showPostsByTaxonomy',
      'archive:view:display:tag':      'showPostsByTaxonomy',
      'archive:view:display:author':   'showPostsByAuthor',

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
      this.page   = options.page || 1;
      this.filter = options.filter || new PostFilter();
      this.posts  = options.posts || new Posts(this.filter);
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
            this.showView(totalPages);
          }.bind(this),

          fail: function () {
            this.show(this.notFoundView()); // we need to change this
          }.bind(this)
        }
      });
    },

    /**
     * Displays a given page
     * @param  {Object} params Object containing the paged parameter
     */
    showPage: function (options) {
      if (this.page !== options.page) {
        this.page = options.page;
        this.filter.onPage(this.page);
        this.show(null, {
          loading: {
            style:    'opacity',
            entities: [this.posts],
            done: function () {
              var route = Navigator.getPagedRoute(this.filter, this.page);
              Navigator.navigate(route, false);
            }.bind(this),

            fail: function () {
              this.show(this.notFoundView()); // we need to change this
            }.bind(this)
          }
        });
      }
    },

    /**
     * Display posts of a given category
     *
     * @param  {Object} params Object containing the category name and page number
     */
    showPostsByTaxonomy: function (params) {
      var slug = params.slug, type = params.type,
          page = 1, trigger = true;
      Navigator.navigateToTaxonomy(type, slug, page, trigger);
    },

    /**
     * Display posts of a given author
     *
     * @param  {Object} params Object containing the author and page number
     */
    showPostsByAuthor: function (params) {
      var slug = params.slug, page = 1, trigger = true;
      Navigator.navigateToAuthor(slug, page, trigger);
    },

    /**
     * Display a given post
     *
     * @param  {Object} params Object containing the post
     */
    showPost: function (params) {
      var post = params.post, page = 1, trigger = true;
      Navigator.navigateToPost(post, page, trigger);
    },

    showView: function (pages) {
      this.show(this._archiveView(this.posts), { region: this.region });
      this.pagination.showPagination({ region: this.mainView.pagination, page: this.page, pages: pages, include: true });
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

  return ArchiveController;
});

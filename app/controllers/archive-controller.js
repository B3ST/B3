/* global define */

define([
  'marionette',
  'controllers/base-controller',
  'controllers/pagination-controller',
  'views/archive-view',
  'helpers/post-filter',
  'collections/post-collection',
  'buses/event-bus',
  'buses/request-bus',
  'buses/navigator'
], function (Marionette, BaseController, PaginationController, ArchiveView, PostFilter, Posts, EventBus, RequestBus, Navigator) {
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
      'pagination:select:page':        'showPage'
    },

    childControllers: {
      pagination: 'paginationController'
    },

    initialize: function (options) {
      this.page    = options.page || 1;
      this.filter  = options.filter || new PostFilter();
      this.posts   = options.posts || new Posts(null, { filter: this.filter });
    },

    /**
     * Display the posts archive.
     *
     * @param {params} Object Object containing a given taxonomy.
     */
    showArchive: function (options) {
      options = options || {};
      this.show(null, {
        loading: {
          entities: [this.posts],
          done: function (collection, status, jqXHR) {
            var totalPages = parseInt(jqXHR.getResponseHeader('X-WP-TotalPages'), 10);
            this.showView(totalPages, options);
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
              $('body,html').animate({ scrollTop: 0 }, 800);
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

    /**
     * Display the archive view and the pagination
     * @param  {int} pages   the number of pages to display
     * @param  {Object} options the options indicating information about the archive
     */
    showView: function (pages, options) {
      this.show(this._archiveView(this.posts, options), { region: this.region });

      // there's some weird bug in this region, haven't figured it out yet.
      var region = this.mainView.pagination || new Marionette.Region({ el: '#pagination' });
      this.pagination.showPagination({ region: region, page: this.page, pages: pages, include: true });
    },

    /**
     * Navigates to a given post
     * @param  {Object} params The object containing the post
     */
    onDisplayPost: function (params) {
      var post = this.posts.get(params.post);
      EventBus.trigger('post:show', { post: post });
      Navigator.navigateToPost(post.get('slug'), null, false);
    },

    /**
     * Displays the given results
     */
    onSearchTerm: function () {
      this.show(null, {
        loading: {
          style: 'opacity',
          entities: [this.posts]
        }
      });
    },

    paginationController: function () {
      return new PaginationController();
    },

    /**
     * Creates a new ArchiveView instance for a post list.
     *
     * @param  {array}       posts Post collection to display.
     * @param  {Object}      model The model containing the information about the archive
     * @return {ArchiveView}       New archive view instance.
     */
    _archiveView: function (posts, options) {
      return new ArchiveView({ collection: posts, options: options });
    }
  });

  return ArchiveController;
});

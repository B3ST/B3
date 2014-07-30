/* globals define */

define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'helpers/post-filter',
  'controllers/event-bus',
  'models/settings-model',
  'models/post-model',
  'models/page-model',
  'collections/post-collection',
  'views/archive-view',
  'views/single-post-view',
  'views/empty-view',
  'views/not-found-view'
], function ($, _, Backbone, Marionette, PostFilter, EventBus, Settings, Post, Page, Posts, ArchiveView, SinglePostView, EmptyView, NotFoundView) {
  'use strict';

  function filterInt (value) {
    return (/^(\-|\+)?([0-9]+|Infinity)$/.test(value)) ? Number(value): NaN;
  }

  function getParams (queryString) {
    var result = {},
        regex  = new RegExp("([^?=&]+)(=([^&]*))?", "g");

    queryString.replace(regex, function (q1, q2, q3, q4) {
      result[q2] = (isNaN(filterInt(q4)) ? q4 : parseInt(q4, 10));
    });

    return result;
  }

  return Backbone.Marionette.Controller.extend({
    initialize: function(options) {
      this.app    = options.app;
      this.posts  = options.posts;
      this.search = new Posts();
      this.user   = options.user;

      _.bindAll(this, 'showEmptySearchView', 'showSearchResults', 'showPreviousView');
      EventBus.bind('search:start', this.showEmptySearchView);
      EventBus.bind('search:term', this.showSearchResults);
      EventBus.bind('search:end', this.showPreviousView);
    },

    /**
     * Display the home page.
     */
    showHome: function () {
      // TODO: Display either a post list or a page according to WordPress'
      // home page settings (full post list vs page ID):

      this.showArchive();
    },

    /**
     * Display the home page post archive.
     *
     * @param {int} page Page number.
     */
    showArchive: function (page) {
      page = page || 1;

      var filter = new PostFilter();
      filter.onPage(page);

      this.posts.fetch({reset: true, data: filter.serialize()});
      this.show(this.archiveView(this.posts, page, filter));
    },

    /**
     * Display the results of a search
     *
     * @param  {string} query The query string
     */
    showSearch: function (query) {
      this.showSearchResults(getParams(query));
    },

    /**
     * Displays a blank page when the user is searching
     */
    showEmptySearchView: function () {
      if (!this.showingEmpty) {
        this.previousView    = this.currentView;
        this.previousOptions = this.currentOptions;
        this.showingEmpty    = true;
        this.show(this.emptyView());
      }
    },

    /**
     * Displays the results of a given search
     *
     * @param  {Object} options The search terms
     */
    showSearchResults: function (options) {
      var page   = options.page || 1,
          filter = new PostFilter({'paging-schema': 'query'});

      filter.bySearchingFor(options.s).onPage(page);

      this.search.fetch({reset: true, data: filter.serialize()})
                 .done(function () { this.show(new ArchiveView({collection: this.search, page: page, filter: filter})); }.bind(this))
                 .fail(function () { this.show(this.notFoundView()); }.bind(this));
    },

    /**
     * Displays the previous view
     */
    showPreviousView: function () {
      this.currentView  = this.previousView;
      this.showingEmpty = false;
      this.show(new this.previousView(this.previousOptions));
    },

    /**
     * Display a post given its unique identifier.
     *
     * @param {int} id   Post ID.
     * @param {int} page Page number.
     */
    showPostById: function (id, page) {
      var post = this.posts.get(id);

      if (post) {
        this.show(this.singlePostView(post, page));
      } else {
        this.fetchModelBy(Post, 'ID', id, page);
      }
    },

    /**
     * Display posts of a given category
     *
     * @param  {string} category Category name
     * @param  {int}    page     Page number
     */
    showPostByCategory: function (category, page) {
      var filter = new PostFilter();
      filter.byCategory(category);
      this.fetchPostsOfPage(filter, page);
    },

    /**
     * Display posts of a given tag
     *
     * @param  {string} tag  Tag name
     * @param  {int}    page Page number
     */
    showPostByTag: function (tag, page) {
      var filter = new PostFilter();
      filter.byTag(tag);
      this.fetchPostsOfPage(filter, page);
    },

    /**
     * Display posts of a given author
     *
     * @param  {string} author Author name
     * @param  {int}    page   Page number
     */
    showPostByAuthor: function (author, page) {
      var filter = new PostFilter();
      filter.byAuthor(author);
      this.fetchPostsOfPage(filter, page);
    },

    /**
     * Display a post given its unique alphanumeric slug.
     *
     * @param {String} slug Post slug.
     * @param {int}    page Page number.
     */
    showPostBySlug: function (slug, page) {
      var post = this.posts.where({slug: slug});

      if (post.length > 0) {
        this.show(this.singlePostView(post[0], page));
      } else {
        this.fetchModelBy(Post, 'slug', slug, page);
      }
    },

    /**
     * Display a page given its unique alphanumeric slug.
     *
     * WordPress allows pages to be placed in a hierarchy. In these
     * situations, the page slug may consist of a slash-separated
     * path.
     *
     * @param {String} slug Page slug.
     * @param {int}    page Page number.
     */
    showPageBySlug: function (slug, page) {
      this.fetchModelBy(Page, 'slug', slug, page);
    },

    /**
     * Fetch all posts using a set of filters and display the
     * corresponding view on success or fail.
     *
     * @param  {PostFilter} filter The filters used to fetch the posts
     * @param  {int}        page   Page number
     */
    fetchPostsOfPage: function (filter, page) {
      filter.onPage(page || 1);
      this.posts.fetch({reset: true, data: filter.serialize()})
          .done(function () { this.show(this.archiveView(this.posts, page, filter)); }.bind(this))
          .fail(function () { this.show(this.notFoundView()); }.bind(this));
    },

    /**
     * Fetch model data by a field.
     *
     * @param {Object} model Post model to populate.
     * @param {String} field Field to use for fetching (ID|slug).
     * @param {mixed}  value Field value.
     * @param {int}    page  Page number.
     */
    fetchModelBy: function (model, field, value, page) {
      var query = {};
      var post;

      query[field] = value;
      post         = new model(query);

      post.fetch()
        .done(function () { this.show(this.singlePostView(post, page)); }.bind(this))
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
     * Creates a new `NotFoundView` instance.
     *
     * @return {NotFoundView} New "Not found" view instance.
     */
    notFoundView: function () {
      return new NotFoundView();
    },

    /**
     * Creates a new `EmptyView` instance
     *
     * @return {EmptyView} New "Empty" view instance
     */
    emptyView: function () {
      return new EmptyView();
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

    /**
     * Creates a new SinglePostView instance for a single post.
     *
     * @param  {Object}            posts Model to display.
     * @param  {int}               page  Page number.
     * @return {SinglePostView}       New single post view instance.
     */
    singlePostView: function (model, page) {
      this.currentView    = SinglePostView;
      this.currentOptions = {model: model, page: page, collection: new Posts(), user: this.user};
      return new SinglePostView(this.currentOptions);
    }
  });
});

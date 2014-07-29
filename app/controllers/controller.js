/* globals define */

define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'helpers/post-filter',
  'models/settings-model',
  'models/post-model',
  'models/page-model',
  'collections/post-collection',
  'views/archive-view',
  'views/single-post-view',
  'views/not-found-view'
], function ($, _, Backbone, Marionette, PostFilter, Settings, Post, Page, Posts, ArchiveView, SinglePostView, NotFoundView) {
  'use strict';

  return Backbone.Marionette.Controller.extend({
    initialize: function(options) {
      this.app   = options.app;
      this.posts = options.posts;
      this.user  = options.user;
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
     * @param  {string} tag  Tag name
     * @param  {int}    page Page number
     */
    showPostByTag: function (tag, page) {
      var filter = new PostFilter();
      filter.byTag(tag);
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
     * Creates a new ArchiveView instance for a post list.
     *
     * @param  {array}       posts Post collection to display.
     * @param  {int}         page  Page number.
     * @param  {Object}      filter The searching filter
     * @return {ArchiveView}       New archive view instance.
     */
    archiveView: function (posts, page, filter) {
      return new ArchiveView({collection: posts, page: page, filter: filter});
    },

    /**
     * Creates a new SinglePostView instance for a single post.
     *
     * @param  {Object}            posts Model to display.
     * @param  {int}               page  Page number.
     * @return {SinglePostView}       New single post view instance.
     */
    singlePostView: function (model, page) {
      return new SinglePostView({
        model:      model,
        page:       page,
        collection: new Posts(),
        user:       this.user
      });
    }
  });
});

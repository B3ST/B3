/* globals define */

define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'helpers/post-filter',
  'controllers/base-controller',
  'controllers/bus/event-bus',
  'controllers/navigation/navigator',
  'collections/comment-collection',
  'models/settings-model',
  'models/post-model',
  'models/page-model'
], function ($, _, Backbone, Marionette, PostFilter, BaseController, EventBus, Navigator, Comments, Settings, Post, Page) {
  'use strict';

  return BaseController.extend({
    postInitialize: function (options) {
      this.page = options.paged || 1;

      _.bindAll(this, 'navigateToCategories', 'navigateToTags', 'navigateToAuthor', 'showPage', 'addComment');
      EventBus.bind('single:display:category', this.navigateToCategories);
      EventBus.bind('single:display:tag', this.navigateToTags);
      EventBus.bind('single:display:author', this.navigateToAuthor);
      EventBus.bind('single:display:page', this.showPage);
      EventBus.bind('comment:create', this.addComment);
    },

    /**
     * Adds a newly created comment
     * @param {Comment} comment The new comment
     */
    addComment: function (comment) {
      comment.set({post: this.post});
      this.collection.add(comment);
      this.collection.sort();
    },

    /**
     * Navigate to page
     * @param  {data} data The page to navigate to
     */
    showPage: function (data) {
      var route = Navigator.getPagedRoute(new PostFilter(), data.page);
      Navigator.navigate(route, false);
    },

    /**
     * Navigates to the category's URL
     * @param  {Object} data Object containing the category slug
     */
    navigateToCategories: function (data) {
      Navigator.navigateToCategory(data.slug, null, true);
    },

    /**
     * Navigates to the tag's URL
     * @param  {Object} data Object containing the tag slug
     */
    navigateToTags: function (data) {
      Navigator.navigateToTag(data.slug, null, true);
    },

    /**
     * Navigate to the author's URL
     * @param  {Object} data Object containing the author slug
     */
    navigateToAuthor: function (data) {
      Navigator.navigateToAuthor(data.slug, null, true);
    },

    /**
     * Display a post given its unique identifier.
     *
     * @param {int} id   Post ID.
     * @param {int} page Page number.
     */
    showPostById: function (params) {
      var id   = params.id,
          post = this.posts.get(id),
          page = params.paged || 1;

      this.showLoading();

      if (post) {
        this._fetchCommentsAndLoad(post);
      } else {
        this._fetchModelBy(Post, 'ID', id, page)
            .then(function (post) { this._fetchCommentsAndLoad(post, page); }.bind(this))
            .fail(function () { this.show(this.notFoundView()); }.bind(this));
      }
    },

    /**
     * Display a post given its unique alphanumeric slug.
     *
     * @param {String} slug Post slug.
     * @param {int}    page Page number.
     */
    showPostBySlug: function (params) {
      var slug = params.post || params.slug,
          page = params.paged || 1,
          post = this.posts.findWhere({slug: slug});

      this.showLoading();

      if (post) {
        this._fetchCommentsAndLoad(post);
      } else {
        this._fetchModelBy(Post, 'slug', slug, page)
            .then(function (post) { this._fetchCommentsAndLoad(post, page); }.bind(this))
            .fail(function () { this.show(this.notFoundView()); }.bind(this));
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
    showPageBySlug: function (params) {
      var slug  = params.page || params.slug,
          paged = params.paged || 1;

      this.showLoading();

      this._fetchModelBy(Page, 'slug', slug, paged)
          .then(function (page) { this._fetchCommentsAndLoad(page, paged); }.bind(this))
          .fail(function () { this.show(this.notFoundView()); }.bind(this));
    },

    /**
     * Fetch comments of a model and display the corresponding view when done
     * @param  {Model} model The model to fetch the comments from
     * @param  {page}  page  The current page
     */
    _fetchCommentsAndLoad: function (model, page) {
      this.collection = new Comments();
      this._fetchCommentsOf(model)
          .done(function (comments) {
            this.collection.add(comments);
            this.show(this.singlePostView(model, this.collection, page));
          }.bind(this))
          .fail(function () { this.show(this.notFoundView()); }.bind(this));
    },

    /**
     * Fetch comments of a model
     * @param  {Model} model The model to fetch the comments from
     * @return {Deferred}    A deferred to complete the action when execution finishes
     */
    _fetchCommentsOf: function (model) {
      var defer = $.Deferred();

      model.fetchComments()
           .done(function (data) { defer.resolve(data.models); })
           .fail(function () { defer.reject(); });

      return defer.promise();
    },

    /**
     * Fetch model data by a field.
     *
     * @param {Object} model Post model to populate.
     * @param {String} field Field to use for fetching (ID|slug).
     * @param {mixed}  value Field value.
     */
    _fetchModelBy: function (model, field, value) {
      var defer = $.Deferred(),
          query = {}, post;

      query[field] = value;
      post         = new model(query);

      post.fetch()
          .done(function () {
            this.post = post;
            defer.resolve(post);
          }.bind(this))
          .fail(function () { defer.reject(); });

      return defer.promise();
    }
  });
});

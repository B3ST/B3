/* globals define */

define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'helpers/post-filter',
  'controllers/base-controller',
  'controllers/bus/event-bus',
  'controllers/bus/command-bus',
  'models/settings-model',
  'models/post-model',
  'models/page-model'
], function ($, _, Backbone, Marionette, PostFilter, BaseController, EventBus, CommandBus, Settings, Post, Page) {
  'use strict';

  return BaseController.extend({
    postInitialize: function() {
      this.loading = this.loadingView();
    },

    /**
     * Display a post given its unique identifier.
     *
     * @param {int} id   Post ID.
     * @param {int} page Page number.
     */
    showPostById: function (params) {
      var post = this.posts.get(params.id),
          page = params.paged;

      if (post) {
        this.show(this.singlePostView(post, page));
        this.hideLoading();
      } else {
        this._fetchModelBy(Post, 'ID', params.id, page);
      }
    },

    /**
     * Display a post given its unique alphanumeric slug.
     *
     * @param {String} slug Post slug.
     * @param {int}    page Page number.
     */
    showPostBySlug: function (params) {
      var slug = params.post,
          page = params.page,
          post = this.posts.where({slug: slug});

      if (post.length > 0) {
        this.show(this.singlePostView(post[0], page));
        this.hideLoading();
      } else {
        this._fetchModelBy(Post, 'slug', slug, page);
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
      var slug = params.page,
          page = params.paged;

      this._fetchModelBy(Page, 'slug', slug, page);
    },

    /**
     * Fetch model data by a field.
     *
     * @param {Object} model Post model to populate.
     * @param {String} field Field to use for fetching (ID|slug).
     * @param {mixed}  value Field value.
     * @param {int}    page  Page number.
     */
    _fetchModelBy: function (model, field, value, page) {
      var post, query = {};

      query[field] = value;
      post         = new model(query);

      post.fetch()
          .done(function () {
            this.show(this.singlePostView(post, page));
            this.hideLoading();
          }.bind(this))
          .fail(function () { this.show(this.notFoundView()); }.bind(this));
    }
  });
});

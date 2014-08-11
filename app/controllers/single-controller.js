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
  'models/page-model',
  'views/single-post-view',
], function ($, _, Backbone, Marionette, PostFilter, BaseController, EventBus, Navigator, Comments, Settings, Post, Page, SinglePostView) {
  'use strict';

  var CommentRegion = new Backbone.Marionette.Region({
    el: ".b3-comments"
  });

  return BaseController.extend({
    postInitialize: function (options) {
      this.post       = null;
      this.page       = options.paged || 1;
      this.collection = new Comments();
      this._bindToEvents();
    },

    _bindToEvents: function () {
      _.bindAll(this, 'navigateToCategories', 'navigateToTags', 'navigateToAuthor', 'navigateToPage', 'showPost', 'showPageById', 'addComment', 'saveCurrentState', 'loadPreviousState');
      EventBus.bind('single:display:category', this.navigateToCategories);
      EventBus.bind('single:display:tag', this.navigateToTags);
      EventBus.bind('single:display:author', this.navigateToAuthor);
      EventBus.bind('single:display:page', this.navigateToPage);

      EventBus.bind('post:show', this.showPost);
      EventBus.bind('page:show', this.showPageById);
      EventBus.bind('comment:create', this.addComment);

      EventBus.bind('search:start', this.saveCurrentState);
      EventBus.bind('search:stop', this.loadPreviousState);
    },

    /**
     * Navigate to page
     * @param  {data} data The page to navigate to
     */
    navigateToPage: function (data) {
      var route = Navigator.getPagedRoute(new PostFilter(), data.page);
      Navigator.navigate(route, false);
    },

    /**
     * Navigates to the category's URL
     * @param  {Object} data Object containing the category slug
     */
    navigateToCategories: function (data) {
      Navigator.navigateToTaxonomy('category', data.slug, null, true);
    },

    /**
     * Navigates to the tag's URL
     * @param  {Object} data Object containing the tag slug
     */
    navigateToTags: function (data) {
      Navigator.navigateToTaxonomy('post_tag', data.slug, null, true);
    },

    /**
     * Navigate to the author's URL
     * @param  {Object} data Object containing the author slug
     */
    navigateToAuthor: function (data) {
      Navigator.navigateToAuthor(data.slug, null, true);
    },

    /**
     * Display a given post
     *
     * @param  {Object} params Object containing the post
     */
    showPost: function (params) {
      this.post = params.post;
      this.collection.reset();
      this.show(this._singlePostView(this.post, this.collection, 1));
      this._loadComments(this.post);
    },

    /**
     * Display a post given its unique identifier.
     *
     * @param  {Object} params An Object containing the post ID and paged attribute
     */
    showPostById: function (params) {
      var id   = params.id,
          page = params.paged || 1;

      this._loadModel(Post, 'ID', id, page);
    },

    /**
     * Display a post given its unique alphanumeric slug.
     *
     * @param  {Object} params An Object containing the post slug and paged attribute
     */
    showPostBySlug: function (params) {
      var slug = params.post || params.slug,
          page = params.paged || 1;

      this._loadModel(Post, 'slug', slug, page);
    },

    /**
     * Display a page by an ID
     *
     * @param  {Object} params An Object containing the page ID and paged attribute
     */
    showPageById: function (params) {
      var page  = params.page,
          paged = params.paged || 1;

      this._loadModel(Page, 'ID', page, paged);
    },

    /**
     * Display a page given its unique alphanumeric slug.
     *
     * WordPress allows pages to be placed in a hierarchy. In these
     * situations, the page slug may consist of a slash-separated
     * path.
     *
     * @param  {Object} params An Object containing the page slug and paged attribute
     */
    showPageBySlug: function (params) {
      var slug  = params.page || params.slug,
          paged = params.paged || 1;

      this._loadModel(Page, 'slug', slug, paged);
    },

    /**
     * Display a post given a custom type
     *
     * @param  {Object} params An Object containing the custom type and paged attribute
     */
    showCustomPost: function (params) {

    },

    /**
     * Saves the current state (post, collection, page and filter)
     */
    saveCurrentState: function () {
      this.state = {
        was_displaying: this.isDisplaying,
        post:           this.post,
        collection:     this.collection,
        page:           this.page
      };
    },

    /**
     * Loads the previously saved state
     */
    loadPreviousState: function () {
      if (this.state.was_displaying) {
        this.collection = this.state.collection;
        this.page       = this.state.page || 1;
        this.post       = this.state.post;
        this.show(this._singlePostView(this.post, this.collection, this.page));
      }
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
     * Loads a given model
     * @param  {Model} model The model type to load
     * @param  {string} field The field to fetch by
     * @param  {string} value The value of the field
     * @param  {string} page  The page number
     */
    _loadModel: function (model, field, value, page) {
      var pageForPosts = Settings.get('page_for_posts');

      this.collection.reset();
      this._displayMainLoading();
      this._fetchModelBy(model, field, value, page)
          .then(function (post) {
            if (post.get('ID') === pageForPosts) {
              EventBus.trigger('archive:show', { paged: page });
            } else {
              this.post = post;
              this.show(this._singlePostView(this.post, this.collection, page));
              this._loadComments(post, page);
            }
          }.bind(this))
          .fail(function () { this.show(this.notFoundView()); }.bind(this));
    },

    /**
     * Fetch comments of a model and display the corresponding view when done
     * @param {Model} model The model to fetch the comments from
     */
    _loadComments: function (model) {
      this._displayCommentLoading();
      this._fetchCommentsOf(model)
          .done(function (comments) { this.collection.reset(comments); }.bind(this))
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
    },

    /**
     * Display loading in the main section
     */
    _displayMainLoading: function () {
      this.showLoading({region: this.app.main});
    },

    /**
     * Display loading in the comment section
     */
    _displayCommentLoading: function () {
      this.showLoading({region: CommentRegion});
    },

    /**
     * Creates a new SinglePostView instance for a single post.
     *
     * @param  {Object}            posts Model to display.
     * @param  {int}               page  Page number.
     * @return {SinglePostView}       New single post view instance.
     */
    _singlePostView: function (model, collection, page) {
      return new SinglePostView({model: model, page: page, collection: collection, user: this.user});
    }
  });
});

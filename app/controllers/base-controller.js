/* global define */

define([
  'jquery',
  'backbone',
  'marionette',
  'controllers/bus/command-bus',
  'collections/comment-collection',
  'views/archive-view',
  'views/single-post-view',
  'views/not-found-view',
  'views/empty-view',
  'views/loading-view'
], function ($, Backbone, Marionette, CommandBus, Comments, ArchiveView, SinglePostView, NotFoundView, EmptyView, LoadingView) {
  'use strict';

  return Marionette.Controller.extend({
    initialize: function(options) {
      this.app     = options.app;
      this.posts   = options.posts;
      this.user    = options.user;

      this.postInitialize(options);
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
     * Triggers a command to display the loading view
     */
    showLoading: function () {
      CommandBus.execute('loading:show');
    },

    /**
     * Triggers a command to hide the loading view
     */
    hideLoading: function () {
      CommandBus.execute('loading:hide');
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
     * Creates a new `EmptyView` instance.
     *
     * @return {EmptyView} New "Empty" view instance.
     */
    emptyView: function () {
      return new EmptyView();
    },

    /**
     * Creates a new `LoadingView` instance.
     *
     * @return {LoadingView} New "Loading" view instance.
     */
    loadingView: function () {
      return new LoadingView();
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
      return new SinglePostView({model: model, page: page, collection: new Comments(), user: this.user});
    }
  });
});
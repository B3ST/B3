/* global define */

define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'buses/command-bus',
  'buses/event-bus',
  'views/not-found-view'
], function ($, _, Backbone, Marionette, CommandBus, EventBus, NotFoundView) {
  'use strict';

  return Marionette.Controller.extend({
    initialize: function(options) {
      this.app   = options.app;
      this.posts = options.posts;
      this.user  = options.user;
      this.state = {};

      if (this.postInitialize) {
        this.postInitialize(options);
      }

      this.bindToEvents();
    },

    bindToEvents: function () {
      _.bindAll(this, 'displayPost');
      EventBus.bind('archive:display:post', this.displayPost);
    },

    onDestroy: function () {
      EventBus.unbind('archive:display:post', this.displayPost);
    },

    /**
     * Resets the displaying state
     * @param  {Object} params The object containing the post
     */
    displayPost: function (params) {
      this.isDisplaying = false;
      this.state.was_displaying = false;
      if (this.onDisplayPost) {
        this.onDisplayPost(params);
      }
    },

    /**
     * Display view.
     *
     * @param {Object} view View to display.
     */
    show: function (view) {
      this.listenTo(view, 'destroy', function () {
        this.isDisplaying = false;
      }.bind(this));
      this.app.main.show(view);
      this.isDisplaying = true;
    },

    /**
     * Triggers a command to display the loading view
     * @param {Region} region The region to display loading
     */
    showLoading: function (region) {
      CommandBus.execute('loading:show', region);
    },

    /**
     * Creates a new `NotFoundView` instance.
     *
     * @return {NotFoundView} New "Not found" view instance.
     */
    notFoundView: function () {
      return new NotFoundView();
    }
  });
});
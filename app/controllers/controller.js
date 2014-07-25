define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'models/post-model',
  'models/page-model',
  'collections/post-collection',
  'views/content-view',
  'views/content-single-view',
  'views/not-found-view'
], function ($, _, Backbone, Marionette, Post, Page, Posts, ContentView, ContentSingleView, NotFoundView) {
  'use strict';

  return Backbone.Marionette.Controller.extend({
    initialize: function(options) {
      this.app   = options.app;
      this.posts = options.posts;
      this.user  = options.user;
    },

    showPostPage: function (page) {
      page = page || 1;
      this.posts.fetch({reset: true, data: $.param({ page: page })});
      this.show(this.contentView(this.posts, page));
    },

    showPostById: function (id, page) {
      var post = this.posts.get(id);

      if (post) {
        this.show(this.singleContentView(post, page));
      } else {
        this.fetchModelBy(Post, 'ID', id, page);
      }
    },

    showPostBySlug: function (slug, page) {
      var post = this.posts.where({slug: slug});

      if (post.length > 0) {
        this.show(this.singleContentView(post[0], page));
      } else {
        this.fetchModelBy(Post, 'slug', slug, page);
      }
    },

    showPageBySlug: function (slug, page) {
      this.fetchModelBy(Page, 'slug', slug);
    },

    fetchModelBy: function (model, field, value, page) {
      var query = {};
      var post;

      query[field] = value;
      post         = new model(query);

      post.fetch()
        .done(function () { this.show(this.singleContentView(post, page)); }.bind(this))
        .fail(function () { this.show(this.error()); }.bind(this));
    },

    show: function (view) {
      this.app.main.show(view);
    },

    error: function () {
      return new NotFoundView();
    },

    contentView: function (posts, page) {
      return new ContentView({collection: posts, page: page});
    },

    singleContentView: function (model, page) {
      return new ContentSingleView({model: model, page: page, collection: new Posts(), user: this.user});
    }
  });
});

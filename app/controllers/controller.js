define([
  'underscore',
  'backbone',
  'marionette',
  'models/post-model',
  'collections/post-collection',
  'views/content-view',
  'views/content-single-view',
  'views/not-found-view'
], function (_, Backbone, Marionette, Post, Posts, ContentView, ContentSingleView, NotFoundView) {
  return Backbone.Marionette.Controller.extend({
    initialize: function(options) {
      this.app   = options.app;
      this.posts = options.posts;
    },

    index: function() {
      this.posts.fetch();
      this.show(this.contentView(this.posts));
    },

    showPost: function (id, page) {
      var post = this.posts.get(id);
      post ? this.show(this.singleContentView(post, page)) : this.fetchPostBy('ID', id);
    },

    showPostBySlug: function (slug, page) {
      var post = this.posts.get(slug);
      post ? this.show(this.singleContentView(post, page)) : this.fetchPostBy('slug', slug);
    },

    fetchPost: function (id) {
      var post = new Post({ID: id});
      post.fetch()
          .done(function () { this.show(this.singleContentView(post)); }.bind(this))
          .fail(function () { this.show(this.error()) }.bind(this));
    },

    fetchPostBy: function (field, value) {
        var query = {};
        var post;

        query[field] = value;
        post         = new Post(query);

        post.fetch()
          .done(function () { this.show(this.singleContentView(post)); }.bind(this))
          .fail(function () { this.show(this.error()) }.bind(this));
    },

    show: function (view) {
      this.app.main.show(view)
    },

    error: function () {
      return new NotFoundView();
    },

    contentView: function (posts) {
      return new ContentView({collection: posts});
    },

    singleContentView: function (post, page) {
      return new ContentSingleView({model: post, page: page, collection: new Posts()});
    }
  });
});

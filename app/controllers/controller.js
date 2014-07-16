define([
  'underscore',
  'backbone',
  'marionette',
  'models/post-model',
  'views/content-view',
  'views/content-single-view',
  'views/error-view'
], function (_, Backbone, Marionette, Post, ContentView, ContentSingleView, ErrorView) {
  return Backbone.Marionette.Controller.extend({
    initialize: function(options) {
      this.app   = options.app;
      this.posts = options.posts;
    },

    index: function() {
      this.posts.fetch();
      this.show(this.contentView(this.posts));
    },

    showPost: function (id) {
      var post = this.posts.get(id);
      post ? this.show(this.singleContentView(post)) : this.fetchPost(id);
    },

    fetchPost: function (id) {
      var post = new Post({ID: id});
      post.fetch()
          .done(function () { this.show(this.singleContentView(post)); }.bind(this))
          .fail(function () { this.show(this.error()) }.bind(this));
    },

    show: function (view) {
      this.app.main.show(view)
    },

    error: function () {
      return new ErrorView();
    },

    contentView: function (posts) {
      return new ContentView({collection: posts});
    },

    singleContentView: function (post) {
      return new ContentSingleView({model: post});
    }
  });
});
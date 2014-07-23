define([
  'underscore',
  'backbone',
  'marionette',
  'models/post-model',
  'models/page-model',
  'collections/post-collection',
  'views/content-view',
  'views/content-single-view',
  'views/not-found-view'
], function (_, Backbone, Marionette, Post, Page, Posts, ContentView, ContentSingleView, NotFoundView) {
  return Backbone.Marionette.Controller.extend({
    initialize: function(options) {
      this.app   = options.app;
      this.posts = options.posts;
      this.user  = options.user;
    },

    index: function() {
      this.posts.fetch({reset: true});
      this.show(this.contentView(this.posts));
    },

    showPostById: function (id, page) {
      var post = this.posts.get(id);
      post ? this.show(this.singleContentView(post, page)) : this.fetchModelBy(Post, 'ID', id);
    },

    showPostBySlug: function (slug, page) {
      var post = this.posts.where({slug: slug});
      post.length > 0 ? this.show(this.singleContentView(post[0], page)) : this.fetchModelBy(Post, 'slug', slug);
    },

    showPageBySlug: function (slug) {
      this.fetchModelBy(Page, 'slug', slug);
    },

    fetchModelBy: function (model, field, value) {
      var query = {};
      var post;

      query[field] = value;
      post         = new model(query);

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

    singleContentView: function (model, page) {
      return new ContentSingleView({model: model, page: page, collection: new Posts()});
    }
  });
});

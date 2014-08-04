/* global define */

define([
  'views/loading-view',
  'controllers/command-bus',

  // just for testing purposes, not a direct dependency
  'views/archive-view',
  'models/post-model',
  'models/user-model',
  'collections/post-collection'
], function (LoadingView, CommandBus, ArchiveView, Post, User, Posts) {
  'use strict';

  describe("LoadingView", function() {
    beforeEach(function() {
      this.posts = new Posts([
        new Post({ID: 1, title: 'Sticky', excerpt: 'Excerpt 1', author: new User({ID: 1, slug: 'author-1', name: 'author-name'}), terms: {category: {ID: 1, slug: 'post-1', link: "http://localhost:8888/wordpress/post/category/content"}, post_tag: {ID: 1, slug: 'tag-1', link: "http://localhost:8888/wordpress/post/tag/content"}}}),
        new Post({ID: 2, title: 'Oh post', excerpt: 'Excerpt 2', author: new User({ID: 1, slug: 'author-2', name: 'author-name'}), terms: {category: {ID: 1, slug: 'post-2', link: "http://localhost:8888/wordpress/post/category/content"}, post_tag: {ID: 2, slug: 'tag-2', link: "http://localhost:8888/wordpress/post/tag/content"}}})
      ]);
      this.archiveView = new ArchiveView({collection: this.posts, limit: 2});
      this.view        = new LoadingView();
      $("#main").append(this.archiveView.render().el);
    });

    afterEach(function() {
      this.archiveView.destroy();
      $(this.archiveView.el).remove();
    });

    describe(".initialize", function() {
      beforeEach(function() {
        this.bus = spyOn(CommandBus, 'setHandler');
        this.view = new LoadingView();
      });

      it("should bind to loading:show command", function() {
        expect(this.bus).toHaveBeenCalledWith('loading:show', this.view.show);
      });

      it("should bind to loading:hide command", function() {
        expect(this.bus).toHaveBeenCalledWith('loading:hide', this.view.hide);
      });

      it("should bind to loading:progress command", function() {
        expect(this.bus).toHaveBeenCalledWith('loading:progress', this.view.progress);
      });
    });

    describe(".show", function() {
      it("should display the loading view", function() {
        this.view.show();
        expect($('.loading-container').is(':visible')).toBeTruthy();
      });
    });

    describe(".hide", function() {
      it("should hide the loading view", function() {
        this.view.hide();
        expect($('.loading-container').is(':visible')).toBeFalsy();
      });
    });
  });
});

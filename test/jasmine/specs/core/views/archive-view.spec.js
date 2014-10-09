define([
  'views/archive-view',
  'models/settings-model',
  'models/taxonomy-model',
  'models/post-model',
  'models/user-model',
  'collections/post-collection',
  'buses/event-bus',
  'buses/command-bus',
  'sinon'
], function (ArchiveView, Settings, Taxonomy, Post, User, Posts, EventBus, CommandBus) {
  'use strict';

  describe("ArchiveView", function() {
    var cbus, view, posts, model;

    beforeEach(function() {
      cbus  = spyOn(CommandBus, 'execute');
      posts = new Posts([
        new Post({ID: 1, title: 'title-1', excerpt: 'Excerpt 1'}),
        new Post({ID: 2, title: 'title-2', excerpt: 'Excerpt 2'})
      ]);

      model = new Taxonomy({ name: 'Title', slug: 'title' });
    });

    describe(".render", function() {
      it("should render the template", function() {
        view = new ArchiveView({ collection: posts, model: model });
        view.render();

        expect(view.$('.post').length).toEqual(2);
      });
    });

    describe("When the collection changes", function() {
      it("should re-render the view", function() {
        view = new ArchiveView({ collection: posts, model: model });
        view.render();
        posts.reset();

        expect(view.$('.post').length).toEqual(0);
      });
    });

    describe("When specifying a type", function() {
      it("should display the type", function() {
        view = new ArchiveView({collection: posts, model: model });
        view.render();

        expect(view.$('.archive-title').text()).toContain('Archive: Title');
      });
    });

    describe("When clicking in title link", function() {
      var trigger;

      beforeEach(function() {
        trigger = spyOn(EventBus, 'trigger');
        posts = new Posts([
          new Post({ID: 1, title: 'title-1', excerpt: 'Excerpt 1', slug: 'post-1'}),
          new Post({ID: 2, title: 'title-2', excerpt: 'Excerpt 2', slug: 'post-2'})
        ]);

        view = new ArchiveView({ collection: posts, model: model });
        view.render();
      });

      it("should trigger a archive:view:display:post event", function() {
        var post = view.$('.title > a').first();
        post.click();
        expect(trigger).toHaveBeenCalledWith('archive:view:display:post', { post: 'post-1' });
      });
    });

    sharedBehaviourFor('category', {
      click:     '.category > a',
      event:     'archive:view:display:category',
      eventOpts: { id: 1, slug: 'post-1', type: 'category' }
    });

    sharedBehaviourFor('tag', {
      click:     '.tag > a',
      event:     'archive:view:display:tag',
      eventOpts: { id: 1, slug: 'tag-1', type: 'post_tag' }
    });

    sharedBehaviourFor('author', {
      click:     '.author > a',
      event:     'archive:view:display:author',
      eventOpts: { id: 1, slug: 'author-1', type: 'author' }
    });
  });

  function sharedBehaviourFor (action, options) {
    describe("When clicking in a " + action, function() {
      var posts, bus, view, model;

      beforeEach(function() {
        posts = new Posts([
          new Post({ID: 1, title: 'Sticky', excerpt: 'Excerpt 1', author: new User({ID: 1, slug: 'author-1', name: 'author-name'}), terms: {category: {ID: 1, slug: 'post-1', link: "http://localhost:8888/wordpress/post/category/content"}, post_tag: {ID: 1, slug: 'tag-1', link: "http://localhost:8888/wordpress/post/tag/content"}}}),
          new Post({ID: 2, title: 'Oh post', excerpt: 'Excerpt 2', author: new User({ID: 1, slug: 'author-2', name: 'author-name'}), terms: {category: {ID: 1, slug: 'post-2', link: "http://localhost:8888/wordpress/post/category/content"}, post_tag: {ID: 2, slug: 'tag-2', link: "http://localhost:8888/wordpress/post/tag/content"}}})
        ]);
        bus   = spyOn(EventBus, 'trigger');
        model = new Taxonomy({ name: 'Title', slug: 'title' });
        view  = new ArchiveView({collection: posts, model: model});

        view.render();
        view.$(options.click).first().click();
      });

      it("should trigger a " + options.event + " event to display the given " + action, function() {
        expect(bus).toHaveBeenCalledWith(options.event, options.eventOpts);
      });
    });
  }
});

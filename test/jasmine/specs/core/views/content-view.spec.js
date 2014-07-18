define([
  'views/content-view',
  'models/post-model',
  'collections/post-collection',
  'controllers/event-bus'
], function (ContentView, Post, Posts, EventBus) {
  describe("ContentView", function() {
    beforeEach(function() {
      this.posts = new Posts([
        new Post({ID: 1, title: 'title-1', excerpt: 'Excerpt 1'}),
        new Post({ID: 2, title: 'title-2', excerpt: 'Excerpt 2'})
      ]);

      this.view = new ContentView({collection: this.posts});
      this.view.render();
    });

    describe(".render", function() {
      it("should render the template", function() {
        expect(this.view.$el.children().length).toEqual(2);
      });
    });

    describe("When the collection changes", function() {
      describe("When adding models to the collection", function() {
        it("should re-render the view", function() {
          this.posts.add(new Post({ID: 3, title: 'title-3', excerpt: 'Excerpt 3'}));
          expect(this.view.$el.children().length).toEqual(3);
        });
      });

      describe("When changing models in the collection", function() {
        it("should re-render the view", function() {
          this.posts.get(1).set({title: 'Changed title'});
          var text = this.view.$('h2 > a')[0];
          expect($(text).text()).toEqual('Changed title');
        });
      });

      describe("When removing a model in the collection", function() {
        it("should re-render the view", function() {
          this.posts.pop();
          expect(this.view.$el.children().length).toEqual(1);
        });
      });

      describe("When the collection is reseted", function() {
        it("should re-render the view", function() {
          this.posts.reset();
          expect(this.view.$el.children().length).toEqual(0);
        });
      });
    });
  });

  describe("When clicking in title link", function() {
    beforeEach(function() {
      this.spy = spyOn(EventBus, 'trigger');
      this.posts = new Posts([
        new Post({ID: 1, title: 'title-1', excerpt: 'Excerpt 1', slug: 'post-1'}),
        new Post({ID: 2, title: 'title-2', excerpt: 'Excerpt 2', slug: 'post-2'})
      ]);

      this.view = new ContentView({collection: this.posts});
      this.view.render();
    });

    it("should trigger an event of navigation", function() {
      this.view.$('.b3-post-title > a').first().click();
      expect(this.spy).wasCalledWith('router:nav', {route: 'post/post-1', options: {trigger: true}});
    });
  });
});

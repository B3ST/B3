define([
  'controllers/controller',
  'models/settings-model',
  'models/user-model',
  'models/post-model',
  'collections/post-collection',
  'views/content-view',
  'views/content-single-view',
  'views/not-found-view',
  'app',
  'sinon'
], function (Controller, Settings, User, Post, Posts, ContentView, ContentSingleView, NotFoundView, App) {
  describe("Controller", function() {
    beforeEach(function() {
      this.app  = App;
      this.user = new User({ID: 1, email: 'email', name: 'name'});
      var response = [
        new Post({ID: 1, title: 'post-1'}).toJSON(),
        new Post({ID: 2, title: 'post-2'}).toJSON()
      ];
      this.server = sinon.fakeServer.create();
      this.server.respondWith(
        'GET',
        Settings.get('url') + '/posts',
        [200, {'Content-Type': 'application/json'}, JSON.stringify(response)]
      );

      this.app.start();
    });

    describe(".index", function() {
      it("should fetch the collection of posts", function() {
        this.spy = spyOn(Posts.prototype, 'fetch');
        this.controller = new Controller({
          posts: new Posts(),
          app:   this.app,
          user:  this.user
        });

        this.controller.index();
        this.server.respond();

        expect(this.spy).toHaveBeenCalled();
      });

      it("should show the content view", function() {
        this.spy = spyOn(this.app.main, 'show');
        this.controller = new Controller({
          posts: new Posts(),
          app:   this.app,
          user:  this.user
        });

        this.controller.index();
        this.server.respond();

        expect(this.spy.mostRecentCall.args[0] instanceof ContentView).toBeTruthy();
      });
    });

    describe(".showPostById", function() {
      it("should show a single content view with the selected post", function() {
        var posts = [
          new Post({ID: 1, title: 'post-1'}),
          new Post({ID: 2, title: 'post-2'})
        ];
        this.spy = spyOn(this.app.main, 'show');

        this.controller = new Controller({
          posts: new Posts(posts),
          app:   App,
          user:  this.user
        });

        this.controller.showPostById(1);

        var view = this.spy.mostRecentCall.args[0];
        expect(view instanceof ContentSingleView).toBeTruthy();
        expect(view.model).toEqual(posts[0]);
      });
    });

    describe("When post is not defined", function() {
      beforeEach(function() {
        this.response = new Post({ID: 2, title: 'title'});
        this.spy = spyOn(Post.prototype, 'fetch').andCallThrough();
        var posts = [this.response];
      });

      it("should fetch the selected post", function() {
        this.controller = new Controller({
          posts: new Posts(),
          app:   App,
          user:  this.user
        });

        this.controller.showPostById(2);
        expect(this.spy).toHaveBeenCalled();
      });

      describe("When fetching is successful", function() {
        it("should display the corresponding view", function() {
          this.spy = spyOn(this.app.main, 'show');
          this.server = sinon.fakeServer.create();
          this.server.respondWith(
            'GET',
            Settings.get('url') + '/posts/2',
            [200, {'Content-Type': 'application/json'}, JSON.stringify(this.response.toJSON())]
          );

          this.controller = new Controller({
            posts: new Posts(posts),
            app:   App,
            user:  this.user
          });
          this.controller.showPostById(2);
          this.server.respond();

          var view = this.spy.mostRecentCall.args[0];
          expect(view instanceof ContentSingleView).toBeTruthy();
          expect(view.model).toBeDefined();
        });
      });

      describe("When fetching fails", function() {
        it("should display an error view", function() {
          this.spy = spyOn(this.app.main, 'show');
          this.server = sinon.fakeServer.create();
          this.server.respondWith(
            'GET',
            Settings.get('url') + '/posts/2',
            [404, {'Content-Type': 'application/json'}, JSON.stringify(this.response.toJSON())]
          );

          this.controller = new Controller({
            posts: new Posts(posts),
            app:   App,
            user:  this.user
          });
          this.controller.showPostById(2);
          this.server.respond();

          var view = this.spy.mostRecentCall.args[0];
          expect(view instanceof NotFoundView).toBeTruthy();
        });
      });
    });

    describe(".showPostBySlug", function() {
      it("should show a single content view with the selected post", function() {
        var posts = [
          new Post({title: 'post-1', slug: 'post-slug-1'}),
          new Post({title: 'post-2', slug: 'post-slug-2'})
        ];
        this.spy = spyOn(this.app.main, 'show');

        this.controller = new Controller({
          posts: new Posts(posts),
          app:   App,
          user:  this.user
        });

        this.controller.showPostBySlug('post-slug-1');

        var view = this.spy.mostRecentCall.args[0];
        expect(view instanceof ContentSingleView).toBeTruthy();
        expect(view.model).toEqual(posts[0]);
      });
    });

    describe("When post is not defined", function() {
      beforeEach(function() {
        this.response = new Post({title: 'title', slug: 'post-slug-2'});
        this.spy = spyOn(Post.prototype, 'fetch').andCallThrough();
        var posts = [this.response];
      });

      it("should fetch the selected post", function() {
        this.controller = new Controller({
          posts: new Posts(posts),
          app:   App,
          user:  this.user
        });

        this.controller.showPostBySlug('post-slug-2');
        expect(this.spy).toHaveBeenCalled();
      });

      describe("When fetching is successful", function() {
        it("should display the corresponding view", function() {
          this.spy = spyOn(this.app.main, 'show');
          this.server = sinon.fakeServer.create();
          this.server.respondWith(
            'GET',
            Settings.get('url') + '/posts/b3:slug:post-slug-2',
            [200, {'Content-Type': 'application/json'}, JSON.stringify(this.response.toJSON())]
          );

          this.controller = new Controller({
            posts: new Posts(posts),
            app:   App,
            user:  this.user
          });
          this.controller.showPostBySlug('post-slug-2');
          this.server.respond();

          var view = this.spy.mostRecentCall.args[0];
          expect(view instanceof ContentSingleView).toBeTruthy();
          expect(view.model).toBeDefined();
        });
      });

      describe("When fetching fails", function() {
        it("should display an error view", function() {
          this.spy = spyOn(this.app.main, 'show');
          this.server = sinon.fakeServer.create();
          this.server.respondWith(
            'GET',
            Settings.get('url') + '/posts/b3:slug:post-slug-2',
            [404, {'Content-Type': 'application/json'}, JSON.stringify('')]
          );

          this.controller = new Controller({
            posts: new Posts(posts),
            app:   App,
            user:  this.user
          });
          this.controller.showPostBySlug('post-slug-2');
          this.server.respond();

          var view = this.spy.mostRecentCall.args[0];
          expect(view instanceof NotFoundView).toBeTruthy();
        });
      });
    });
  });
});

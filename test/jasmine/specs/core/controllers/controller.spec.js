define([
  'controllers/controller',
  'models/settings-model',
  'models/user-model',
  'models/post-model',
  'models/page-model',
  'collections/post-collection',
  'views/content-view',
  'views/content-single-view',
  'views/not-found-view',
  'app',
  'sinon'
], function (Controller, Settings, User, Post, Page, Posts, ContentView, ContentSingleView, NotFoundView, App) {
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

    afterEach(function() {
      this.app.main.$el.html('');
    });

    describe(".showPostPage", function() {
      it("should fetch the collection of posts of a given page", function() {
        this.spy = spyOn(Posts.prototype, 'fetch');
        this.controller = new Controller({
          posts: new Posts(),
          app:   this.app,
          user:  this.user
        });

        this.controller.showPostPage(2);
        this.server.respond();

        expect(this.spy).toHaveBeenCalledWith({reset: true, data: $.param({ page: 2 })});
      });

      it("should show the content view", function() {
        this.spy = spyOn(this.app.main, 'show');
        this.controller = new Controller({
          posts: new Posts(),
          app:   this.app,
          user:  this.user
        });

        this.controller.showPostPage(2);
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
              posts: new Posts(),
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
              posts: new Posts(),
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

      describe("When post is not defined", function() {
        beforeEach(function() {
          this.response = new Post({title: 'title', slug: 'post-slug-2'});
          this.spy = spyOn(Post.prototype, 'fetch').andCallThrough();
          var posts = [this.response];
        });

        it("should fetch the selected post", function() {
          this.controller = new Controller({
            posts: new Posts(),
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
              posts: new Posts(),
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
              posts: new Posts(),
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

    describe(".showPageBySlug", function() {
      it("should fetch the corresponding page", function() {
        this.spy = spyOn(Page.prototype, 'fetch').andCallThrough();
        this.controller = new Controller({
          posts: new Posts(),
          app:   this.app
        });
        this.controller.showPageBySlug('page-slug');

        expect(this.spy).toHaveBeenCalled();
      });

      describe("When fetching is successful", function() {
        it("should display the corresponding view", function() {
          var response = {"ID":1150,"title":"Parent Page","status":"publish","type":"page","author":{"ID":2,"username":"manovotny","name":"Michael Novotny","first_name":"Michael","last_name":"Novotny","nickname":"manovotny","slug":"manovotny","URL":"","avatar":"http:\/\/0.gravatar.com\/avatar\/60cb31e323d15f1c0fc1a59ac17ba484?s=96","description":"","registered":"2014-07-21T13:51:25+00:00","meta":{"links":{"self":"http:\/\/localhost:8888\/wordpress\/wp-json\/users\/2","archives":"http:\/\/localhost:8888\/wordpress\/wp-json\/users\/2\/posts"}}},"content":"<p>This page the a parent page.<\/p>\n<p>It contains child pages.<\/p>\n","parent":0,"link":"http:\/\/localhost:8888\/wordpress\/parent-page","date":"2013-03-15T18:24:09+00:00","modified":"2013-03-15T18:24:09+00:00","format":"standard","slug":"parent-page","guid":"http:\/\/wptest.io\/demo\/?page_id=1088","excerpt":"<p>This page the a parent page. It contains child pages.<\/p>\n","menu_order":0,"comment_status":"open","ping_status":"open","sticky":false,"date_tz":"UTC","date_gmt":"2013-03-15T23:24:09+00:00","modified_tz":"UTC","modified_gmt":"2013-03-15T23:24:09+00:00","meta":{"links":{"self":"http:\/\/localhost:8888\/wordpress\/wp-json\/pages\/parent-page","author":"http:\/\/localhost:8888\/wordpress\/wp-json\/users\/2","collection":"http:\/\/localhost:8888\/wordpress\/wp-json\/pages","replies":"http:\/\/localhost:8888\/wordpress\/wp-json\/pages\/1150\/comments","version-history":"http:\/\/localhost:8888\/wordpress\/wp-json\/pages\/1150\/revisions"}},"featured_image":null,"terms":[]};
          this.spy    = spyOn(this.app.main, 'show');
          this.server = sinon.fakeServer.create();
          this.server.respondWith(
            'GET',
            Settings.get('url') + '/pages/page-slug',
            [200, {'Content-Type': 'application/json'}, JSON.stringify(response)]
          );

          this.controller = new Controller({
            posts: new Posts(),
            app:   this.app
          });
          this.controller.showPageBySlug('page-slug');
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
            Settings.get('url') + '/pages/page-slug',
            [404, {'Content-Type': 'application/json'}, JSON.stringify('')]
          );

          this.controller = new Controller({
            posts: new Posts(),
            app:   this.app
          });
          this.controller.showPageBySlug('page-slug');
          this.server.respond();

          var view = this.spy.mostRecentCall.args[0];
          expect(view instanceof NotFoundView).toBeTruthy();
        });
      });
    });
  });
});

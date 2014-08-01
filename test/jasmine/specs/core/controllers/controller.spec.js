define([
  'controllers/controller',
  'models/settings-model',
  'models/user-model',
  'models/post-model',
  'models/page-model',
  'collections/post-collection',
  'views/archive-view',
  'views/single-post-view',
  'views/empty-view',
  'views/not-found-view',
  'controllers/event-bus',
  'controllers/command-bus',
  'app',
  'sinon'
], function (Controller, Settings, User, Post, Page, Posts, ArchiveView, SinglePostView, EmptyView, NotFoundView, EventBus, CommandBus, App) {
  'use strict';

  function stubServer (options) {
    var server = sinon.fakeServer.create();
    server.respondWith(
      'GET',
      options.url,
      [options.code, {'Content-Type': 'application/json'}, JSON.stringify(options.response)]
    );

    return server;
  }

  function sharedBehaviourForSingle (options) {
    describe(options.method, function() {
      beforeEach(function() {
        this.cBus  = spyOn(CommandBus, 'execute');
        this.posts = [
          new Post({ID: 1, title: 'post-1', slug: 'post-slug-1'}),
          new Post({ID: 2, title: 'post-2', slug: 'post-slug-2'})
        ];
        this.appShow = spyOn(this.app.main, 'show');

        this.controller = new Controller({
          posts: new Posts(this.posts),
          app:   App,
          user:  this.user
        });

        options.runTestMethod(this.controller);
      });

      it("should show a single content view with the selected post", function() {
        var view = this.appShow.mostRecentCall.args[0];
        expect(view instanceof SinglePostView).toBeTruthy();
        expect(view.model).toEqual(this.posts[0]);
      });

      it("should trigger a loading:hide command", function() {
        expect(this.cBus).toHaveBeenCalledWith('loading:hide');
      });

      describe("When post is not defined", function() {
        beforeEach(function() {
          this.response   = new Post({ID: 1, title: 'title'});
          this.fetch      = spyOn(Post.prototype, 'fetch').andCallThrough();
          this.controller = new Controller({
            posts: new Posts(),
            app:   App,
            user:  this.user
          });

          options.runTestMethod(this.controller);
        });

        it("should fetch the selected post", function() {
          expect(this.fetch).toHaveBeenCalled();
        });

        describe("When fetching is successful", function() {
          beforeEach(function() {
              this.server = stubServer({
              response: this.response.toJSON(),
              url:      options.request,
              code:     200
            });

            this.controller = new Controller({
              posts: new Posts(),
              app:   App,
              user:  this.user
            });

            options.runTestMethod(this.controller);
            this.server.respond();
          });

          it("should display the corresponding view", function() {
            var view = this.appShow.mostRecentCall.args[0];
            expect(view instanceof SinglePostView).toBeTruthy();
            expect(view.model).toBeDefined();
          });

          it("should trigger a loading:hide command", function() {
            expect(this.cBus).toHaveBeenCalledWith('loading:hide');
          });
        });

        describe("When fetching fails", function() {
          beforeEach(function() {
            this.server = stubServer({
              response: '',
              url:      options.request,
              code:     404
            });

            this.controller = new Controller({
              posts: new Posts(),
              app:   App,
              user:  this.user
            });
            options.runTestMethod(this.controller);
            this.server.respond();
          });

          it("should display a not found view", function() {
            var view = this.appShow.mostRecentCall.args[0];
            expect(view instanceof NotFoundView).toBeTruthy();
          });
        });
      });
    });
  }

  function sharedBehaviourForArchiveOfType (type, options) {
    describe(options.method, function() {
      it("should fetch the corresponding posts of a given " + type, function() {
        this.spy = spyOn(Posts.prototype, 'fetch').andCallThrough();
        this.controller = new Controller({
          posts: new Posts(),
          app:   this.app
        });
        options.runTestMethod(this.controller);

        expect(this.spy).toHaveBeenCalled();
      });

      describe("When fetching is successful", function() {
        it("should show the archive view", function() {
          var response = new Post({ID: 1});
          this.spy = spyOn(this.app.main, 'show');
          this.server = sinon.fakeServer.create();
          this.server.respondWith(
            'GET',
            options.request,
            [200, {'Content-Type': 'application/json'}, JSON.stringify([response.toJSON()])]
          );

          this.controller = new Controller({
            posts: new Posts(),
            app:   this.app,
            user:  this.user
          });

          options.runTestMethod(this.controller);
          this.server.respond();

          expect(this.spy.mostRecentCall.args[0] instanceof ArchiveView).toBeTruthy();
        });
      });

      describe("When fetching fails", function() {
        it("should show a not found view", function() {
          this.spy = spyOn(this.app.main, 'show');
          this.server = sinon.fakeServer.create();
          this.server.respondWith(
            'GET',
            options.request,
            [404, {'Content-Type': 'application/json'}, JSON.stringify('')]
          );

          this.controller = new Controller({
            posts: new Posts(),
            app:   App,
            user:  this.user
          });
          options.runTestMethod(this.controller);
          this.server.respond();

          var view = this.spy.mostRecentCall.args[0];
          expect(view instanceof NotFoundView).toBeTruthy();
        });
      });
    });
  }

  describe("Controller", function() {
    beforeEach(function() {
      this.app  = App;
      this.user = new User({ID: 1, email: 'email', name: 'name'});
      this.app.start();
    });

    afterEach(function() {
      this.app.main.$el.html('');
      this.app.header.$el.html('');
      this.app.footer.$el.html('');
      window.scrollTo(0, 0);
    });

    describe(".initialize", function() {
      beforeEach(function() {
        this.bus = spyOn(EventBus, 'bind');
        this.controller = new Controller({});
      });

      it("should bind to search:start event", function() {
        expect(this.bus).toHaveBeenCalledWith('search:start', this.controller.showEmptySearchView);
      });

      it("should bind to search:term event", function() {
        expect(this.bus).toHaveBeenCalledWith('search:term', this.controller.showSearchResults);
      });

      it("should bind to search:end event", function() {
        expect(this.bus).toHaveBeenCalledWith('search:end', this.controller.showPreviousView);
      });
    });

    describe(".showArchive", function() {
      beforeEach(function() {
        var response = [
          new Post({ID: 1, title: 'post-1'}).toJSON(),
          new Post({ID: 2, title: 'post-2'}).toJSON()
        ];

        this.server = stubServer({
          response: response,
          url:      Settings.get('apiUrl') + '/posts',
          code:     200
        });

        this.bus        = spyOn(CommandBus, 'execute');
        this.posts      = spyOn(Posts.prototype, 'fetch').andCallThrough();
        this.controller = new Controller({
          posts: new Posts(),
          app:   this.app,
          user:  this.user
        });

        this.controller.showArchive(2);
        this.server.respond();
      });

      it("should fetch the collection of posts of a given page", function() {
        expect(this.posts).toHaveBeenCalledWith({reset: true, data: $.param({ page: 2 })});
      });

      it("should trigger a loading:show command", function() {
        expect(this.bus).toHaveBeenCalledWith('loading:show', jasmine.any(Object));
      });

      describe("When fetching is successful", function() {
        beforeEach(function() {
          this.spy = spyOn(this.app.main, 'show');
          var response = [
            new Post({ID: 1, title: 'post-1'}).toJSON(),
            new Post({ID: 2, title: 'post-2'}).toJSON()
          ];
          this.server = stubServer({
            url:      Settings.get('apiUrl') + '/posts?page=2',
            code:     200,
            response: response
          });

          this.controller = new Controller({
            posts: new Posts(),
            app:   this.app,
            user:  this.user
          });

          this.controller.showArchive(2);
          this.server.respond();
        });

        it("should show the archive view", function() {
          expect(this.spy.mostRecentCall.args[0] instanceof ArchiveView).toBeTruthy();
        });

        it("should trigger a loading:hide command", function() {
          expect(this.bus).toHaveBeenCalledWith('loading:hide');
        });
      });
    });

    describe(".showEmptySearchView", function() {
      beforeEach(function() {
        this.spy        = spyOn(this.app.main, 'show');
        this.controller = new Controller({
          posts: new Posts(),
          app:   this.app,
          user:  this.user
        });

        this.controller.show(this.controller.archiveView());
      });

      it("should display a blank empty view", function() {
        this.controller.showEmptySearchView();

        var view = this.spy.mostRecentCall.args[0];
        expect(view instanceof EmptyView).toBeTruthy();
      });

      it("should save the previous view", function() {
        this.controller.showEmptySearchView();
        expect(this.controller.previousView).toBeDefined();
      });
    });

    describe(".showSearchResults", function() {
      it("should query with the given term", function() {
        this.fetch      = spyOn(Posts.prototype, 'fetch').andCallThrough();
        this.controller = new Controller({
          posts: new Posts(),
          app:   this.app,
          user:  this.user
        });

        this.controller.showSearchResults({s: 'term'});
        expect(this.fetch).toHaveBeenCalledWith({reset: true, data: 'filter[s]=term&page=1'});
      });

      describe("When fetching is successful", function() {
        it("should display the given results", function() {
          this.spy = spyOn(this.app.main, 'show');
          var response = [
            new Post({ID: 1, title: 'post-1'}).toJSON(),
            new Post({ID: 2, title: 'post-2'}).toJSON()
          ];
          this.server = stubServer({
            response: response,
            url:      Settings.get('apiUrl') + '/posts?filter[s]=term&page=1',
            code:     200
          });
          this.controller = new Controller({
            posts: new Posts(),
            app:   this.app,
            user:  this.user
          });

          this.controller.showSearchResults({s: 'term'});
          this.server.respond();

          var view = this.spy.mostRecentCall.args[0];
          expect(view instanceof ArchiveView).toBeTruthy();
        });
      });

      describe("When fetching fails", function() {
        it("should display a not found view", function() {
          this.spy = spyOn(this.app.main, 'show');
          this.server = stubServer({
            response: '',
            url:      Settings.get('apiUrl') + '/posts?filter[s]=term&page=1',
            code:     404
          });

          this.controller = new Controller({
            posts: new Posts(),
            app:   this.app,
            user:  this.user
          });

          this.controller.showSearchResults({s: 'term'});
          this.server.respond();

          var view = this.spy.mostRecentCall.args[0];
          expect(view instanceof NotFoundView).toBeTruthy();
        });
      });
    });

    describe(".showSearch", function() {
      it("should display the results of the given query", function() {
        this.spy = spyOn(Controller.prototype, 'showSearchResults');
        this.controller = new Controller({
          posts: new Posts(),
          app:   this.app,
          user:  this.user
        });

        this.controller.showSearch('s=term&page=2');
        expect(this.spy).toHaveBeenCalledWith({s: 'term', page: 2});
      });
    });

    describe(".showPreviousView", function() {
      it("should display the view prior to the search", function() {
        this.spy        = spyOn(this.app.main, 'show');
        this.controller = new Controller({
          posts: new Posts(),
          app:   this.app,
          user:  this.user
        });

        this.controller.show(this.controller.archiveView());
        this.controller.showEmptySearchView();
        this.controller.showPreviousView();

        var view = this.spy.mostRecentCall.args[0];
        expect(view).toBeDefined();
        expect(view).not.toBeNull();
      });
    });

    sharedBehaviourForSingle({
      method: ".showPostById",
      runTestMethod: function (controller) {
        controller.showPostById(1);
      },
      request: Settings.get('apiUrl') + '/posts/1'
    });

    sharedBehaviourForSingle({
      method: ".showPostBySlug",
      runTestMethod: function  (controller) {
        controller.showPostBySlug('post-slug-1');
      },
      request: Settings.get('apiUrl') + '/posts/b3:slug:post-slug-1'
    });

    sharedBehaviourForArchiveOfType('category', {
      method: ".showPostByCategory",
      runTestMethod: function  (controller) {
        controller.showPostByCategory('category');
      },
      request: Settings.get('apiUrl') + '/posts?filter[category_name]=category&page=1',
    });

    sharedBehaviourForArchiveOfType('tag', {
      method: ".showPostByTag",
      runTestMethod: function (controller) {
        controller.showPostByTag('tag');
      },
      request: Settings.get('apiUrl') + '/posts?filter[tag]=tag&page=1'
    });

    sharedBehaviourForArchiveOfType('author', {
      method: ".showPostByAuthor",
      runTestMethod: function  (controller) {
        controller.showPostByAuthor('author');
      },
      request: Settings.get('apiUrl') + '/posts?filter[author_name]=author&page=1'
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
          this.server = stubServer({
            response: response,
            url:      Settings.get('apiUrl') + '/pages/page-slug',
            code:     200
          });

          this.controller = new Controller({
            posts: new Posts(),
            app:   this.app
          });
          this.controller.showPageBySlug('page-slug');
          this.server.respond();

          var view = this.spy.mostRecentCall.args[0];
          expect(view instanceof SinglePostView).toBeTruthy();
          expect(view.model).toBeDefined();
        });
      });

      describe("When fetching fails", function() {
        it("should display an error view", function() {
          this.spy = spyOn(this.app.main, 'show');
          this.server = stubServer({
            response: '',
            url:      Settings.get('apiUrl') + '/pages/page-slug',
            code:     404
          });

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

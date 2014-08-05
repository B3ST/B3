define([
  'controllers/single-type-controller',
  'models/settings-model',
  'models/user-model',
  'models/post-model',
  'models/page-model',
  'collections/post-collection',
  'views/single-post-view',
  'views/empty-view',
  'views/not-found-view',
  'controllers/bus/command-bus',
  'app',
  'sinon'
], function (SingleTypeController, Settings, User, Post, Page, Posts, SinglePostView, EmptyView, NotFoundView, CommandBus, App) {
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

        this.controller = new SingleTypeController({
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
          this.controller = new SingleTypeController({
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

            this.controller = new SingleTypeController({
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

            this.controller = new SingleTypeController({
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

  describe("SingleTypeController", function() {
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

    sharedBehaviourForSingle({
      method: ".showPostById",
      runTestMethod: function (controller) {
        controller.showPostById({id: 1});
      },
      request: Settings.get('apiUrl') + '/posts/1'
    });

    sharedBehaviourForSingle({
      method: ".showPostBySlug",
      runTestMethod: function  (controller) {
        controller.showPostBySlug({post: 'post-slug-1'});
      },
      request: Settings.get('apiUrl') + '/posts/b3:slug:post-slug-1'
    });

    describe(".showPageBySlug", function() {
      it("should fetch the corresponding page", function() {
        this.spy = spyOn(Page.prototype, 'fetch').andCallThrough();
        this.controller = new SingleTypeController({
          posts: new Posts(),
          app:   this.app
        });
        this.controller.showPageBySlug({page: 'page-slug'});

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

          this.controller = new SingleTypeController({
            posts: new Posts(),
            app:   this.app
          });
          this.controller.showPageBySlug({page: 'page-slug'});
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

          this.controller = new SingleTypeController({
            posts: new Posts(),
            app:   this.app
          });
          this.controller.showPageBySlug({page: 'page-slug'});
          this.server.respond();

          var view = this.spy.mostRecentCall.args[0];
          expect(view instanceof NotFoundView).toBeTruthy();
        });
      });
    });
  });
});

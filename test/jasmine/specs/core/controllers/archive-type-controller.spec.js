/* global define */

define([
  'app',
  'controllers/archive-type-controller',
  'controllers/bus/command-bus',
  'models/post-model',
  'models/settings-model',
  'models/user-model',
  'collections/post-collection',
  'views/archive-view',
  'views/not-found-view',
  'sinon'
], function (App, ArchiveTypeController, CommandBus, Post, Settings, User, Posts, ArchiveView, NotFoundView) {
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

  function sharedBehaviourForArchiveOfType (type, options) {
    describe(options.method, function() {
      it("should fetch the corresponding posts of a given " + type, function() {
        this.spy = spyOn(Posts.prototype, 'fetch').andCallThrough();
        this.controller = new ArchiveTypeController({
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
          this.server = stubServer({
            url: options.request,
            code: 200,
            response: [response.toJSON()]
          });

          this.controller = new ArchiveTypeController({
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
          this.server = stubServer({
            url: options.request,
            code: 404,
            response: ''
          });

          this.controller = new ArchiveTypeController({
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

  describe("ArchiveTypeController", function() {
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
        this.controller = new ArchiveTypeController({
          posts: new Posts(),
          app:   this.app,
          user:  this.user
        });

        this.controller.showArchive({paged: 2});
        this.server.respond();
      });

      it("should fetch the collection of posts of a given page", function() {
        expect(this.posts).toHaveBeenCalledWith({reset: true, data: $.param({ page: 2 })});
      });

      it("should trigger a loading:show command", function() {
        expect(this.bus).toHaveBeenCalledWith('loading:show');
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

          this.controller = new ArchiveTypeController({
            posts: new Posts(),
            app:   this.app,
            user:  this.user
          });

          this.controller.showArchive({paged: 2});
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

    sharedBehaviourForArchiveOfType('category', {
      method: ".showPostByCategory",
      runTestMethod: function  (controller) {
        controller.showPostByCategory({category: 'category'});
      },
      request: Settings.get('apiUrl') + '/posts?filter[category_name]=category&page=1',
    });

    sharedBehaviourForArchiveOfType('tag', {
      method: ".showPostByTag",
      runTestMethod: function (controller) {
        controller.showPostByTag({post_tag: 'tag'});
      },
      request: Settings.get('apiUrl') + '/posts?filter[tag]=tag&page=1'
    });

    sharedBehaviourForArchiveOfType('author', {
      method: ".showPostByAuthor",
      runTestMethod: function  (controller) {
        controller.showPostByAuthor({author: 'author'});
      },
      request: Settings.get('apiUrl') + '/posts?filter[author_name]=author&page=1'
    });
  });
});